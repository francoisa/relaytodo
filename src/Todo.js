import React, { Component } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import EditTodoMutation from './EditTodoMutation';

class Todo extends Component {
  constructor(props) {
    super(props);
    const {text, status } = this.props.todo;
    this.state = {text: text, status: status}

    this.submitTextChange = this.submitTextChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }
  handleTextChange(event) {
    this.setState({text: event.target.value});
    EditTodoMutation.commit(
          this.props.relay.environment,
          null,
          event.target.value,
          this.props.todo,
        );
  }
  submitTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleStatusChange(event) {
    this.setState({status: event.target.value})
    EditTodoMutation.commit(
          this.props.relay.environment,
          event.target.value,
          null,
          this.props.todo,
        );
  }
  render() {
    const {text, status } = this.state;
    return (
      <li>
           <select name='status' value={status} onChange={this.handleStatusChange}>
             <option value='open'>open</option>
             <option value='working'>working</option>
             <option value='blocked'>blocked</option>
             <option value='closed'>closed</option>
           </select>&nbsp;
           <input type="text" name="text" value={text}
             onChange={this.handleTextChange}
             onBlur={this.submitTextChange}
           />
      </li>
    );
  }
}

export default createFragmentContainer(
  Todo,
  graphql`
    fragment Todo_todo on Todo {
      id
      status
      text
    }
  `
);
