import React, { Component } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import EditTodoMutation from '../mutations/EditTodoMutation';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';

class Todo extends Component {
  constructor(props) {
    super(props);
    const {text, status } = this.props.todo;
    this.state = {text: text, status: status, orig: text};

    this.submitTextChange = this.submitTextChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(event) {
    DeleteTodoMutation.commit(
      this.props.relay.environment,
      this.props.todo,
      this.props.userId
    );
  }
  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  handleKeyPress(event) {
    if (event.charCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      if (this.state.orig !== this.state.text) {
        EditTodoMutation.commit(
              this.props.relay.environment,
              null,
              this.state.text,
              this.props.todo,
              this.props.userId
            );
        this.setState({orig: this.state.text});
      }
    }
  }
  submitTextChange(event) {
    if (this.state.orig !== event.target.value) {
      EditTodoMutation.commit(
            this.props.relay.environment,
            null,
            event.target.value,
            this.props.todo,
            this.props.userId
          );
      this.setState({orig: event.target.value});
    }
  }
  handleStatusChange(event) {
    this.setState({status: event.target.value});
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
             onKeyPress={this.handleKeyPress}
           />
           <button onClick={this.handleDelete}>X</button>
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
