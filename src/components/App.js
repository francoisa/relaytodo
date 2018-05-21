import React, { Component } from 'react';
import '../css/App.css';
import environment from '../relay-environment';
import {graphql, QueryRenderer} from 'react-relay';
import Todolist from './Todolist';
import AddTodo from './AddTodo';

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
                  <div className='subheading'>welcome: {props.viewer.username}</div>
                  <AddTodo environment={environment} viewer={props.viewer}/>
                  <Todolist todos={props.viewer} userId={props.viewer.id}/>
                </div>);
            }}
           />
         </div>
       </div>
    );
  }
}

export default App;
