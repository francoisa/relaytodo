import {graphql, commitMutation} from 'react-relay';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation EditTodoMutation($input: EditTodoInput!) {
    editTodo(input: $input) {
      todoEdge {
        node {
          id
          text
          status
        }
        cursor
      }
    }
  }
`;

function sharedUpdater(store, {id, text, status}) {
  const todoProxy = store.get(id);
  todoProxy.setValue(text, 'text');
  todoProxy.setValue(status,'status');
}

function commit(
  environment,
  status,
  text,
  todo,
  userId
) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {status: status, text: text, nodeId: todo.id, userId: userId},
      },
      optimisticUpdater: (store) => {
        sharedUpdater(store, {id: todo.id, text: text, status: status});
      },
      updater: (store) => {
        const payload = store.getRootField('editTodo');
        const todoEdge = payload.getLinkedRecord('todoEdge');
        const nodeProxy = todoEdge.getLinkedRecord('node');
        const node = {id: nodeProxy.getValue('id')};
        node.text = nodeProxy.getValue('text');
        node.status = nodeProxy.getValue('status');
        sharedUpdater(store, node);
      }
    }
  );
}

export default {commit};
