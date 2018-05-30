import { setDao, TodoSchema } from '../server/todolistSchema.js';
import { ObjectDao } from '../server/todolistObjectDao.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

const pp = function(actual, expected) {
  return 'expected ' + JSON.stringify(actual, undefined, 2) + ' to equal ' +
  JSON.stringify(expected, undefined, 2);
};

describe('Todo create mutations', () => {
  it('adds a todo', async () => {
    const mutation = `
      mutation AddTodoQuery($input: AddTodoInput!) {
        addTodo(input: $input) {
          todoEdge {
            node {
              id
              text
            }
          }
          clientMutationId
        }
      }
    `;
    const params = {
      input: {
          userId: 'dmlld2VyOjE',
          text: 'stew chicken',
          clientMutationId: 'unknown'
      }
    };
    const expected = {
      addTodo: {
        todoEdge: {
          node: {
            id: 'VG9kbzo1',
            text: 'stew chicken'
          }
        },
        clientMutationId: 'unknown'
      }
    };
    const result = await graphql(TodoSchema, mutation, null, new ObjectDao(), params);
    expect(result).toEqual({ data: expected });
  });
});

describe('Todo update mutations', () => {
  var dao = new ObjectDao();
  it('updates a todo\'s text', async () => {
    const mutation = `
      mutation EditTodoQuery($input: EditTodoInput!) {
        editTodo(input: $input) {
          todoEdge {
            node {
              id
              text
              status
            }
          }
          clientMutationId
        }
      }
    `;
    const params = {
      input: {
        userId: 'dmlld2VyOjE',
        nodeId: 'VG9kbzox',
        text: 'mill wheatberries',
        clientMutationId: 'unknown'
      }
    };
    const expected = {
      editTodo: {
        todoEdge: {
          node: {
            id: 'VG9kbzox',
            text: 'mill wheatberries',
            status: 'open'            
          }
        },
        clientMutationId: 'unknown'
      }
    };
    const result = await graphql(TodoSchema, mutation, null, dao, params);
    expect(result).toEqual({ data: expected });
  });
  afterEach(() => {
    var todo = dao.getTodo('1');
    todo.text = 'mill flour';
  });
});

describe('Session creation mutations', () => {
  it('create a viewer', async () => {
    const mutation = `
      mutation CreateSessionMutation($input: CreateSessionInput!) {
        createSession(input: $input) {
          viewer {
            id
            username
          }
        }
      }
    `;
    const params = {
      input: {
        username: 'francoisa',
        password: 'password'
      }
    };
    const expected = {
      createSession: {
        viewer: {
          id: 'dmlld2VyOjE=',
          username: 'francoisa'
        }
      }
    };
    const result = await graphql(TodoSchema, mutation, null, new ObjectDao(), params);
    expect(result).toEqual({ data: expected });
  });
});
