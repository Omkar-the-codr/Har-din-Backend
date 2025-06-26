const { gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }
  input BookInput {
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!) : Book
  }

  type Mutation {
    createBook(input: BookInput): Book!
    updateBook(id: ID!, title: String, author: String): Book
    delete(id: ID!): String
  }
`;

module.exports = typeDefs;
