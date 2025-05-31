const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const typeDefs = require("./typeDefs.js");
const resolvers = require("./resolvers.js");

const MONGO_URI = process.env.MONGO_URI;


const startServer = async () => {
  const app = express();
  app.use(express.json()); // Important for parsing JSON

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app , path: "/api/graphql"});

  mongoose
    .connect(MONGO_URI, {
    })
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen({ port: 4000 }, () => {
        console.log(
          `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
        );
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

startServer();
