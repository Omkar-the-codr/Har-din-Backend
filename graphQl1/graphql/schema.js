const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!): User
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): String
  }
`;

module.exports = typeDefs;
