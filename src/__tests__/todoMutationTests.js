import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TodoSchema } from '../server/todolistSchema.js';
import { getTodo } from '../server/todolistData.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

describe('Todo add mutations', () => {
  it('add a todo', async () => {
    const mutation = `
      mutation AddTodoQuery($input: AddTodoInput!) {
        addTodo(input: $input) {
          todo {
            id
            text
          }
          clientMutationId
        }
      }
    `;
    const params = {
      input: {
          text: 'stew chicken',
          clientMutationId: 'unknown'
      }
    };
    const expected = {
      addTodo: {
        todo: {
          id: 'VG9kbzo1',
          text: 'stew chicken'
        },
        clientMutationId: 'unknown'
      }
    };
    const result = await graphql(TodoSchema, mutation, null, null, params);
    expect(result).to.deep.equal({ data: expected });
  });
});

describe('Todo update mutations', () => {
  it('update a todo', async () => {
    const mutation = `
      mutation EditTodoQuery($input: EditTodoInput!) {
        editTodo(input: $input) {
          todo {
            id
            text
            status
          }
          clientMutationId
        }
      }
    `;
    const params = {
      input: {
        nodeId: '1',
        text: 'mill wheatberries',
        clientMutationId: 'unknown'
      }
    };
    const expected = {
      editTodo: {
        todo: {
          id: 'VG9kbzox',
          text: 'mill wheatberries',
          status: 'open'
        },
        clientMutationId: 'unknown'
      }
    };
    const result = await graphql(TodoSchema, mutation, null, null, params);
    expect(result).to.deep.equal({ data: expected });
  });
  after(() => {
    var todo = getTodo('1');
    todo.text = 'mill flour';
  });
});

describe('Session create mutations', () => {
  it('create a session', async () => {
    const mutation = `
      mutation CreateSessionMutation($input: CreateSessionInput!) {
        createSession(input: $input) {
          session {
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
        session: {
          id: 'U2Vzc2lvbjox',
          username: 'francoisa'
        }
      }
    };
    const result = await graphql(TodoSchema, mutation, null, null, params);
    expect(result).to.deep.equal({ data: expected });
  });
});
