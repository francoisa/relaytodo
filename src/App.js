import React, { Component } from 'react';
import './App.css';
import environment from './relay-environment';
import {graphql, QueryRenderer} from 'react-relay';

class App extends Component {
  render() {
    return (
       <div className="App">
          <header className="App-header">
           <h1 className="App-title">Todo</h1>
          </header>
         <div className="App-intro">
           <QueryRenderer
             environment={environment}
             query={graphql`
                       query AppQuery($nodeId: String!) {
                         viewer (nodeId: $nodeId) {
                           id
                           username
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
              return <div>username: {props.viewer.username}</div>;
            }}
           />
         </div>
       </div>
    );
  }
}

export default App;
