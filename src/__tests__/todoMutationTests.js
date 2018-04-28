import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TodoSchema } from '../server/todolistSchema.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

describe('Todo mutations', () => {
  it('mutates the data set', async () => {
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
