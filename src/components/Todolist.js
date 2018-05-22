import React, { Component } from 'react';
import {graphql, createPaginationContainer} from 'react-relay';
import Todo from './Todo';

class Todolist extends Component {
  constructor(props) {
    super(props);
      this._loadMore = this._loadMore.bind(this);
  }
  render() {
    const { list } = this.props.todos;
      return (
         <div>
             <ul className="todolist">
               {list.edges.map(edge =>
                 <Todo
                   key={edge.node.id}
                   todo={edge.node}
                   userId={this.props.userId}
                 />
               )}
              </ul>
              <div>
                <button onClick={this._loadMore}>More...</button>
              </div>
          </div>
    );
  }
  _loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(
      1,  // Fetch the next 10 feed items
        error => {
            if (error) {
                console.log('error: ' + error);
            }
      }
    );
  }
}

export default createPaginationContainer(
    Todolist,
    {
        todos: graphql`
          fragment Todolist_todos on viewer
          @argumentDefinitions(
            count: {type: "Int", defaultValue: 1}
            cursor: {type: "String"}
          ) {
            list(first: $count, after: $cursor)
              @connection(key: "Todolist_list") {
              edges {
                node {
                  id,
                  ...Todo_todo
                }
              }
            }
          }

        `
    },
    {
        direction: 'forward',
        getConnectionFromProps(props) {
            return props.todos && props.todos.list;
        },
        getFragmentVariables(prevVars, totalCount) {
            return {
              ...prevVars,
              count: totalCount
            };
         },
        getVariables(props, {count, cursor}, fragmentVariables) {
              return {
               count,
               cursor,
               // userID isn't specified as an @argument for the fragment, but it should be a variable available for the fragment under the query root.
               userID: props.userId
             };
         },
         query: graphql`
           # Pagination query to be fetched upon calling _loadMore.
           # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
           query TodolistPaginationQuery(
             $count: Int!
             $cursor: String
             $userID: ID!
           ) {
             todos: node(id: $userID) {
             ...Todolist_todos @arguments(count: $count, cursor: $cursor)
             }
           }
         `
       }
);
