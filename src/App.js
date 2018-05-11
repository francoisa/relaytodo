import React, { Component } from 'react';
import './App.css';
import environment from './relay-environment';
import {graphql, QueryRenderer} from 'react-relay';
import Todolist from './Todolist';

class App extends Component {
  render() {
    return (
       <div className="App">
          <header className="App-header">
           <h1 className="App-title">Todo</h1>
          </header>
         <div className="list">
           <QueryRenderer
             environment={environment}
             query={graphql`
                       query AppQuery($nodeId: String!) {
                         viewer (nodeId: $nodeId) {
                           id,
                           username,
                           ...Todolist_todos
                         }
                       }
                    `}
             variables={{nodeId: "1"}}
             render={({error, props}) => {
              if  (error) {
                return <div>Error!</div>;
              }
              if (!props) {
                return <div>Loading...</div>;
              }
              return (
                <div>
                  <div>username: {props.viewer.username}</div>
                  <Todolist todos={props.viewer}/>
                </div>);
            }}
           />
         </div>
       </div>
    );
  }
}

export default App;
