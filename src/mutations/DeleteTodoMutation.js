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

function sharedUpdater(store, user, deletedId) {
  console.log('user: ' + JSON.stringify(Object.keys(user)));
  const viewerProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    viewerProxy,
    'Todolist_list'
  );
  ConnectionHandler.deleteNode(conn, deletedId);
}

function commit(
  environment,
  todo,
  user) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {nodeId: todo.id},
      },
      optimisticUpdater: (store) => {
        sharedUpdater(store, user, todo.id);
      },
      updater: (store) => {
        const payload = store.getRootField('deleteTodo');
        sharedUpdater(store, user, payload.getValue('deletedId'));      }
    }
  );
}

export default {commit};
