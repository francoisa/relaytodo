var listItems = {
  '1': { id: '1', text: 'mill flour', status: 'open'},
  '2': { id: '2', text: 'buy milk', status: 'working'},
  '3': { id: '3', text: 'do taxes', status: 'blocked'},
  '4': { id: '4', text: 'clean bathroom', status: 'closed'}
};

var user = {
  id: '1',
  name: 'Andre Francois',
  username: 'francoisa',
  password: 'password',
  list: ['1', '2', '3', '4']
};

export function createSession(username, password) {
    if (user.username === username &&
        user.password === password) {
          return user
    }
    else {
      return {status: 'not found'};
    }
}

export function getSession(id) {
    if (user.id === id) {
          return user
    }
    else {
      return {status: 'not found'};
    }
}

export function getTodo(id) {
    return listItems[id];
}

export function addTodo(text) {
  let id = String(Object.keys(listItems).length+1);
  listItems[id] = {id: id, text: text, status: 'open'};
  user.list.push(id);
  return listItems[id];
}

export function editTodo(id, text, status) {
  if (id in listItems) {
    listItems[id] = {id: id, text: text, status: status};
  }
}

export function deleteTodo(id) {
  if (id in listItems) {
    delete listItems[id];
    return true;
  }
  else {
    return false;
  }
}
