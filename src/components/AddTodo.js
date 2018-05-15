import React, { Component } from 'react';
import AddTodoMutation from '../mutations/AddTodoMutation';

class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};

    this.addTodo = this.addTodo.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event) {
    this.setState({text: event.target.value});
  }
  addTodo(event) {
    this.setState({text: event.target.value});
    AddTodoMutation.commit(
      this.props.environment,
      this.state.text,
      this.props.viewer
    );
    this.setState({text: ''});
  }
  render() {
    const { text } = this.state;
    return (
        <div className='addform'>
          <input type='text' name='text' value={text}
             onChange={this.handleTextChange}></input>&nbsp;
          <button onClick={this.addTodo}>Add</button>
        </div>
    );
  }
}

export default AddTodo;
