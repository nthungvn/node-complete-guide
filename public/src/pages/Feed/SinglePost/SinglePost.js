import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `
        query GetPost($postId: ID!) {
          getPost(postId: $postId) {
            title content imageUrl creator { name } createdAt
          }
        }
      `,
      variables: { postId },
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
          throw new Error('Fetching post failed');
        }

        const post = resData.data.getPost;
        this.setState({
          title: post.title,
          author: post.creator.name,
          date: new Date(post.createdAt).toLocaleDateString('en-US'),
          content: post.content,
          image: 'http://localhost:8080/' + post.imageUrl,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
