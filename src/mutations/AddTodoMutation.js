import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';
// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      todoEdge {
        node {
          id
          status
          text
        }
        cursor
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  console.log(JSON.stringify(Object.keys(user)));
  const viewerProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    viewerProxy,
    'Todolist_list',
  );
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

function commit(
  environment,
  text,
  user) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {text: text, userId: user.id}
      },
      updater: (store) => {
        const payload = store.getRootField('addTodo');
        console.log(JSON.stringify(Object.keys(payload)));
        const newEdge = payload.getLinkedRecord('todo');
        sharedUpdater(store, user, newEdge);
      },
      optimisticUpdater: (store) => {
        const id = 'client:newTodo:' + tempID++;
        const node = store.create(id, 'Todo');
        node.setValue('open', 'status');
        node.setValue(text, 'text');
        node.setValue(id, 'id');
        const edgeId = 'client:newEdge:' + tempID++;
        const newEdge = store.create(
          edgeId,
          'TodoEdge'
        );
        newEdge.setLinkedRecord(node, 'node');
        sharedUpdater(store, user, newEdge);
        const userProxy = store.get(user.id);
        userProxy.setValue(
          userProxy.getValue('totalCount') + 1,
          'totalCount'
        );
      }
    }
  );
}

export default {commit};
