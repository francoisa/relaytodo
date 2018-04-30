const express = require('express');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('express-jwt');
const schema = require('./todolistSchema').TodoSchema;
const serve = require('webpack-serve');

const APP_PORT = 3000;
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
graphQLServer.use('/graphql', graphQLHTTP({
    schema: schema,
    graphiql: true
}));

graphQLServer.listen(GRAPHQL_PORT);
console.log('App listening on port 4000');

const config = require('./webpack.config.js');

serve({ config }).then((server) => {
      assert(server);
  setTimeout(() => server.close(done), 1000);
});
