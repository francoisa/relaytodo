import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation DeleteTodoMutation($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      deletedId
    }
  }
`;

function sharedUpdater(store, userId, deletedId) {
  const viewerProxy = store.get(userId);
  const conn = ConnectionHandler.getConnection(
    viewerProxy,
    'Todolist_list'
  );
  ConnectionHandler.deleteNode(conn, deletedId);
}

function commit(
  environment,
  todo,
  userId) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {nodeId: todo.id},
      },
      optimisticUpdater: (store) => {
        sharedUpdater(store, userId, todo.id);
      },
      updater: (store) => {
        const payload = store.getRootField('deleteTodo');
        sharedUpdater(store, userId, payload.getValue('deletedId'));
      }
    }
  );
}

export default {commit};
