import {graphql, commitMutation} from 'react-relay';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation DeleteTodoMutation($input: DeleteTodoInput!) {
    deleteTodo(input: $input) {
      todo {
        id
      }
    }
  }
`;

function commit(
  environment,
  todo
) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {nodeId: todo.id},
      },
    }
  );
}

export default {commit};
