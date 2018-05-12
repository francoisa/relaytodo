import React, { Component } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Todo from './Todo';

class Todolist extends Component {
  render() {
    const { list } = this.props.todos;
    return (
         <ul>
           {list.edges.map(edge =>
             <Todo
               key={edge.node.id}
               todo={edge.node}
             />
           )}
         </ul>
    );
  }
}

export default createFragmentContainer(
  Todolist,
  graphql`
    fragment Todolist_todos on viewer {
      list(first: 2147483647) {
        edges {
          node {
            id,
            ...Todo_todo
          }
        }
      }
      id
    }
  `
);
