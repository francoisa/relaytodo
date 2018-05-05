const express = require('express');
const graphQLHTTP = require('express-graphql');
const schema = require('./src/server/todolistSchema').TodoSchema;
const ObjectDao =  require('./src/server/todolistData').ObjectDao;
const jwt = require('express-jwt');

const GRAPHQL_PORT = 8080;

const handleNonRoot = function (req, res, next) {
  if (req && req.path === '/favicon.ico') {
    res.sendFile(path.resolve(__dirname, 'public', 'favicon.ico'));
  }
  else if (next) {
    next();
  }
}

const graphQLServer = express();
const dao = new ObjectDao();
graphQLServer.use('/graphql', graphQLHTTP({
    schema: schema,
    context: dao,
    graphiql: true
}));

graphQLServer.listen(GRAPHQL_PORT);
console.log('App listening on port ' + GRAPHQL_PORT);
