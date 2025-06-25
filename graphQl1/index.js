const express = require("express");
const {ApolloServer} = require("apollo-server-express");


const typeDefs = require("./graphql/schema.js");
const resolvers = require("./graphql/resolvers.js");


async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({app});

    const PORT =3000;
    app.listen(PORT, () =>{
        console.log("Server is running on port 3000")
});
}
startServer();