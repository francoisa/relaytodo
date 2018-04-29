const express = require('express');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('express-jwt');
const schema = require('./todolistSchema').TodoSchema;

const app = express();
app.use('/graphql', graphQLHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000);
console.log('App listening on port 4000');
