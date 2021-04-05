const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String,
    status: String!,
    posts: [Post!]!
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  type AuthData {
    userId: ID!
    token: String!
  }

  type PostData {
    posts: [Post!]
    totalPosts: Int!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User
    createPost(postInput: PostInputData): Post
    updatePost(postId: ID!, postInput: PostInputData!): Post
    deletePost(postId: ID!): String
    updateUserStatus(status: String!): String
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPosts(page: Int): PostData!
    getPost(postId: ID!): Post!
    getUser: User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
