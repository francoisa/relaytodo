import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import {
  getSession,
  getTodo,
  addTodo,
  editTodo
} from './todolistData';

/**
 * interface Node {
 *   id: ID!
 * }
 *
 * type Session : Node {
 *   id: ID!
 *   name: String
 *   list: TodoConnection
 * }
 *
 * type Todo : Node {
 *   id: ID!
 *   text: String
 *   status: String
 * }
 *
 * type TosoConnection {
 *   edges: [TodoEdge]
 *   pageInfo: PageInfo!
 * }
 *
 * type TodoEdge {
 *   cursor: String!
 *   node: Todo
 * }
 *
 * type PageInfo {
 *   hasNextPage: Boolean!
 *   hasPreviousPage: Boolean!
 *   startCursor: String
 *   endCursor: String
 * }
 *
 * type Query {
 *   getTodo(input: TodoInput): Todo
 *   node(id: ID!): Node
 * }
 *
 * input SessionInput {
 *   username: String!,
 *   password: String!
 * }
 *
 * type SessionPayload {
 *   clientMutationId: string
 *   username: String,
 *   token: String,
 *   list: TodoConnection
 * }
 *
 * type AddTodoPayload {
 *   clientMutationId: string
 *   todo: Todo
 * }
 *
 * type Mutation {
 *   session(input: SessionInput): SessionPayload
 *   addTodo(input: AddTodoInput!): AddTodoPayload
 * }
 */

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Session') {
      return getSession(id);
    }
    if (type === 'Todo') {
      return getTodo(id);
    }
  },
  obj => {
    return obj.session ? sessionType : todoType;
  }
);

const todoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'A user who hjas logged in',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    text: {
      type: GraphQLString,
      description: 'The text of the todo item.',
    },
  })
});

const { connectionType: todoConnection } =
  connectionDefinitions({ nodeType: todoType });

/**
 * We define our faction type, which implements the node interface.
 *
 * This implements the following type system shorthand:
 *   type Faction : Node {
 *     id: String!
 *     name: String
 *     ships: ShipConnection
 *   }
 */
const sessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'A logged in user',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    email: {
      type: GraphQLString,
      description: 'email address.',
    },
    username: {
      type: GraphQLString,
      description: 'first and last name.',
    },
    token: {
      type: GraphQLString,
      description: 'jwt tokwn.',
    },
    list: {
      type: todoConnection,
      description: 'The user\'s todo list.',
      args: connectionArgs,
      resolve: (session, args) => connectionFromArray(
        session.list.map(getTodo),
        args
      ),
    }
  })
});

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema.
*/
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todo: {
      type: todoType,
      args: {
        nodeId: { type: new GraphQLNonNull(GraphQLString) }
      },
        resolve: (_, {nodeId}) => getTodo(nodeId)
    },
    node: nodeField
  })
});

/**
 * This will return a GraphQLFieldConfig for our ship
 * mutation.
 */
const addTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    todo: {
      type: todoType,
      resolve: payload => getTodo(payload.id)
    }
  },
  mutateAndGetPayload: ({ text }) => {
    const newTodo = addTodo(text);
    return {
      id: newTodo.id
    };
  }
});

/**
 * This is the type that will be the root of our mutations, and the
 * entry point into performing writes in our schema.
 *
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodo: addTodoMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const TodoSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});