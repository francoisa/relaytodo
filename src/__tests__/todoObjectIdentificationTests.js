import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setDao, TodoSchema } from '../server/todolistSchema';
import { ObjectDao } from '../server/todolistData.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

describe('Todo object identification', () => {
  it('fetches the ID and text of a todo', async () => {
    const query = `
      query TodoQuery {
        todo(nodeId: "1") {
          id
          text
        }
      }
    `;
    const expected = {
      todo: {
        id: 'VG9kbzox',
        text: 'mill flour'
      }
    };
    const result = await graphql(TodoSchema, query, null, new ObjectDao());
    expect(result).to.deep.equal({ data: expected });
  });

  it('refetches the todo', async () => {
    const query = `
      query TodoRefetchQuery {
        node(id: "VG9kbzox") {
          id
          ... on Todo {
            text
          }
        }
      }
    `;
    const expected = {
      node: {
        id: 'VG9kbzox',
        text: 'mill flour'
      }
    };
    const result = await graphql(TodoSchema, query, null, new ObjectDao());
    expect(result).to.deep.equal({ data: expected });
  });
});
