import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
const schema  = require('./todolistSchema').TodoSchema;
const ObjectDao = require('./todolistData').ObjectDao;

const GRAPHQL_PORT = 8080;

const handleNonRoot = function(req, res, next) {
  if (req && req.path === '/favicon.ico') {
    res.sendFile(path.resolve(__dirname, '../../public', 'favicon.ico'));
  }
  else if (next) {
    next();
  }
}

// Expose a GraphQL endpoint
const graphQLServer = express();
const dao = new ObjectDao();
graphQLServer.use('/', handleNonRoot, graphQLHTTP(
  {
    schema: schema,
    context: dao,
    graphiql: true,
    pretty: true
  })
);

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `server:GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
