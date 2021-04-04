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

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User
    createPost(postInput: PostInputData): Post
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
