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
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

/**
 * interface Node {
 *   id: ID!
 * }
 *
 * type viewer : Node {
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
 *   createSession(input: SessionInput): SessionPayload
 *   addTodo(input: AddTodoInput!): AddTodoPayload
 *   editTodo(input: AddTodoInput!): AddTodoPayload
 *   removeTodo(input: AddTodoInput!): AddTodoPayload
 * }
 */

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, dao) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Viewer') {
      return dao.getSession(id);
    }
    if (type === 'Todo') {
      return dao.getTodo(id);
    }
    return null;
  },
  obj => {
    return obj.view ? viewerType : todoType;
  }
);

const todoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'A task',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    text: {
      type: GraphQLString,
      description: 'The text of the todo item.'
    },
    status: {
      type: GraphQLString,
      description: 'The status of the todo item.'
    }
  })
});

const { connectionType: todoConnection, edgeType: GraphQLTodoEdge } =
  connectionDefinitions({ name: 'Todo', nodeType: todoType });

const viewerType = new GraphQLObjectType({
  name: 'viewer',
  description: 'A logged in user',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    email: {
      type: GraphQLString,
      description: 'email address.'
    },
    username: {
      type: GraphQLString,
      description: 'first and last name.'
    },
    token: {
      type: GraphQLString,
      description: 'jwt tokwn.'
    },
    list: {
      type: todoConnection,
      description: 'The user\'s todo list.',
      args: connectionArgs,
      resolve: (viewer, args, dao) => connectionFromArray(
        viewer.list.map(dao.getTodo),
        args
      )
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todo: {
      type: todoType,
      args: {
        nodeId: { type: new GraphQLNonNull(GraphQLString) }
      },
        resolve: (_, {nodeId}, dao) => dao.getTodo(nodeId)
    },
    viewer: {
      type: viewerType,
      args: {
        nodeId: { type: new GraphQLNonNull(GraphQLString) }
      },
        resolve: (_, {nodeId}, dao) => dao.getSession(nodeId)
    },
    node: nodeField
  })
});

const addTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    clientMutationId: {type: GraphQLString},
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({localTodoId, userId}, args, dao) => {
        console.log('userId: ' + userId + ' localTodoId: ' + localTodoId);
        const todo = dao.getTodo(localTodoId);
        console.log('todo: ' + JSON.stringify(todo));
        console.log('todos: ' + JSON.stringify(dao.getTodos(userId)));
        return {
          cursor: cursorForObjectInConnection(dao.getTodos(userId), todo),
          node: todo
        };
      }
    }
  },
  mutateAndGetPayload: ({ text, userId }, dao) => {
    const newTodo = dao.addTodo(text);
    const {id} = fromGlobalId(userId);
    return {localTodoId: newTodo.id, userId: id};
  }
});

const editTodoMutation = mutationWithClientMutationId({
  name: 'EditTodo',
  inputFields: {
    nodeId: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  outputFields: {
    todo: {
      type: todoType,
      resolve: payload => payload
    }
  },
  mutateAndGetPayload: ({ nodeId, text, status }, dao) => {
    const { id } = fromGlobalId(nodeId);
    const updatedTodo = dao.editTodo(id, text, status);
    return updatedTodo;
  }
});

const createSessionMutation = mutationWithClientMutationId({
  name: 'CreateSession',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    viewer: {
      type: viewerType,
      resolve: payload => payload
    }
  },
  mutateAndGetPayload: ({ username, password }, dao) => {
    const newSession = dao.createSession(username, password);
    return newSession;
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
    addTodo: addTodoMutation,
    editTodo: editTodoMutation,
    createSession: createSessionMutation
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
