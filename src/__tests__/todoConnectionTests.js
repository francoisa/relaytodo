import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TodoSchema } from '../server/todolistSchema.js';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

describe('Todo connections', () => {
  it('fetches the first task of the todolist', async () => {
    const query = `
      query GetSessionQuery {
        session(nodeId: "1") {
          username
          list(first: 1) {
            edges {
              node {
                text
              }
            }
          }
        }
      }
    `;
    const expected = {
      session: {
        username: 'francoisa',
        list: {
          edges: [
            {
              node: {
                text: 'mill flour'
              }
            }
          ]
        }
      }
    };
    const result = await graphql(TodoSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('fetches the first two tasks of the todo list with a cursor', async () => {
    const query = `
      query MoreTodosQuery {
        session(nodeId: "1") {
          username,
          list(first: 2) {
            edges {
              cursor,
              node {
                text
              }
            }
          }
        }
      }
    `;
    const expected = {
      session: {
        username: 'francoisa',
        list: {
          edges: [
            {
              cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              node: {
                text: 'mill flour'
              }
            },
            {
              cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
              node: {
                text: 'buy milk'
              }
            }
          ]
        }
      }
    };
    const result = await graphql(TodoSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('fetches the next three tasks of the todo list with a cursor', async () => {
    const query = `
      query EndOfListQuery {
        session(nodeId: "1") {
          username,
          list(first: 2 after: "YXJyYXljb25uZWN0aW9uOjE=") {
            edges {
              cursor,
              node {
                text
              }
            }
          }
        }
      }
    `;
    const expected = {
      session: {
        username: 'francoisa',
        list: {
          edges: [
            {
              cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
              node: {
                text: 'do taxes'
              }
            },
            {
              cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
              node: {
                text: 'clean bathroom'
              }
            }
          ]
        }
      }
    };
    const result = await graphql(TodoSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('fetches no tasks of the todo list at the end of connection', async () => {
    const query = `
      query SessionQuery {
        session(nodeId: "1") {
          username,
          list(first: 3 after: "YXJyYXljb25uZWN0aW9uOjQ=") {
            edges {
              cursor,
              node {
                text
              }
            }
          }
        }
      }
    `;
    const expected = {
      session: {
        username: 'francoisa',
        list: {
          edges: []
        }
      }
    };
    const result = await graphql(TodoSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });

  it('identifies the end of the list', async () => {
    const query = `
      query EndOfSessionQuery {
        session(nodeId: "1") {
          username,
          originalTodos: list(first: 2) {
            edges {
              node {
                text
              }
            }
            pageInfo {
              hasNextPage
            }
          }
          moreTodos: list(first: 3 after: "YXJyYXljb25uZWN0aW9uOjE=") {
            edges {
              node {
                text
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    `;
    const expected = {
      session: {
        username: 'francoisa',
        originalTodos: {
          edges: [
            {
              node: {
                text: 'mill flour'
              }
            },
            {
              node: {
                text: 'buy milk'
              }
            }
          ],
          pageInfo: {
            hasNextPage: true
          }
        },
        moreTodos: {
          edges: [
            {
              node: {
                text: 'do taxes'
              }
            },
            {
              node: {
                text: 'clean bathroom'
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    };
    const result = await graphql(TodoSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });
});
