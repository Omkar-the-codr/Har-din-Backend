const {ApolloServer} = require('apollo-server');

const typeDefs = require('./schema/typeDefs.js');
const resolvers = require('./schema/resolvers.js');

const server = new ApolloServer({typeDefs, resolvers});


server.listen(3000,()=>{
    console.log("Server is running at port 3000");
})