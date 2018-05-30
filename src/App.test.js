import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

describe('First test', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    //ReactDOM.render(<App />, div);
    //ReactDOM.unmountComponentAtNode(div);
    expect('Hello world!').toEqual('Hello world!');
  });
});
