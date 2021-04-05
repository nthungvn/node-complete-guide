import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    const graphqlQuery = {
      query: `
        {
          getUser {
            status
          }
        }
      `,
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors && resData.errors[0].statusCode === 401) {
          throw new Error('Validation failed.');
        }
        if (resData.errors) {
          throw new Error('Fetching posts failed');
        }
        this.setState({ status: resData.data.getUser.status });
      })
      .catch(this.catchError);
    this.loadPosts();
  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    const graphqlQuery = {
      query: `
        query {
          getPosts(page: ${page}) {
            totalPosts posts { _id content title creator { name } imageUrl createdAt updatedAt }
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors && resData.errors[0].statusCode === 401) {
          throw new Error('Login failed.');
        }
        if (resData.errors) {
          throw new Error('Failed to get status');
        }
        const postsData = resData.data.getPosts;
        this.setState({
          posts: postsData.posts.map(post => ({
            ...post,
            imagePath: post.imageUrl,
          })),
          totalPosts: postsData.totalPosts,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation {
          updateUserStatus(status: "${this.state.status}")
        }
      `,
    };
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.props.token,
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors && resData.errors[0].statusCode === 401) {
          throw new Error('Login failed.');
        }
        if (resData.errors) {
          throw new Error('Failed to update status');
        }
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });

    const formData = new FormData();
    formData.append('image', postData.image);
    if (this.state.editPost) {
      formData.append('oldImagePath', this.state.editPost.imagePath);
    }

    fetch('http://localhost:8080/post-image', {
        method: 'PUT',
        headers: {
          authorization: 'Bearer ' + this.props.token,
        },
        body: formData,
      })
      .then((res => res.json()))
      .then((data) => {
        const imageUrl = data.imagePath;
        let graphqlQuery;
        if (this.state.editPost) {
          graphqlQuery = {
            query: `
              mutation {
                updatePost(postId: "${this.state.editPost._id}", postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl: "${imageUrl}"}) {
                  _id title content creator { _id name } createdAt imageUrl
                }
              }
          `
          };
        } else {
          graphqlQuery = {
            query: `
              mutation {
                createPost(postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl: "${imageUrl}"}) {
                  _id title content creator { _id name } createdAt imageUrl
                }
              }
          `
          };
        }
        return fetch('http://localhost:8080/graphql', {
          headers: {
            authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(graphqlQuery),
        });
      })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors && resData.errors[0].statusCode === 401) {
          throw new Error('Validation failed.');
        }
        if (resData.errors) {
          throw new Error('Failed to update/create post');
        }

        let returnedPost;
        if (this.state.editPost) {
          returnedPost = resData.data.updatePost;
        } else {
          returnedPost = resData.data.createPost;
        }

        const post = {
          _id: returnedPost._id,
          title: returnedPost.title,
          content: returnedPost.content,
          creator: returnedPost.creator,
          createdAt: returnedPost.createdAt,
          imagePath: returnedPost.imageUrl,
        };
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id,
            );
            updatedPosts[postIndex] = post;
          } else {
            if (prevState.posts.length >= 2) {
              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
    };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(postId: "${postId}")
        }
      `,
    };
    fetch('http://localhost:8080/graphql', {
      headers: {
        authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.errors && resData.errors[0].statusCode === 401) {
          throw new Error('Validation failed.');
        }
        if (resData.errors) {
          throw new Error('Failed to delete post');
        }
        this.setState(prevState => {
          const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
