const { ApolloServer, gql } = require('apollo-server-express');
const { sequelize} = require('./models');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// The GraphQL schema
const typeDefs = require('./graphQL/typeDefs');

// A map of functions which return data for the schema.
const resolvers = require('./graphQL/resolvers');
const contextMiddleware = require('./util/contextMiddleware')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

const app = express();
app.use(bodyParser.urlencoded({extended:true,limit: '1mb'}))
server.applyMiddleware({ app });

app.use(express.static('public'))
app.use(cors())

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);