import {graphql, commitMutation} from 'react-relay';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation EditTodoMutation($input: EditTodoInput!) {
    editTodo(input: $input) {
      todo {
        id
        status
      }
    }
  }
`;

function commit(
  environment,
  status,
  text,
  todo
) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {status: status, text: text, nodeId: todo.id},
      },
    }
  );
}

export default {commit};
