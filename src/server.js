const express = require('express')
const graphQLHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const jwt = require('express-jwt')

const root = {
  hello: () => {
    return 'Hello World!'
  }
}

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const app = express()
app.use('/graphql', graphQLHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000)
console.log('App listening on port 4000')
