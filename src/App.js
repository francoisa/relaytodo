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
         <p className="App-intro">
           <QueryRenderer
             environment={environment}
             query={graphql`
                       query AppQuery {
                         viewer (nodeId: "1") {
                           id
                         }
                       }
                    `}
             variables={{}}
             render={({error, props}) => {
              if  (error) {
                return <div>Error!</div>;
              }
              if (!props) {
                return <div>Loading...</div>;
              }
              return <div>User ID: {props.viewer.id}</div>;
            }}
           />
         </p>
       </div>
    );
  }
}

export default App;
