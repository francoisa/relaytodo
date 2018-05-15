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

export function ObjectDao() {}

ObjectDao.prototype.createSession = function(username, password) {
    if (user.username === username &&
        user.password === password) {
      return user;
    }
    else {
      return {status: 'not found'};
    }
}

ObjectDao.prototype.getSession = function(id) {
    if (user.id === id) {
      return user;
    }
    else {
      return {status: 'not found'};
    }
}

ObjectDao.prototype.getTodos = function(id) {
  if (user.id === id) {
    return listItems;
  }
  else {
    return {status: 'not found'};
  }
}

ObjectDao.prototype.getTodo = function(id) {
    return listItems[id];
}

ObjectDao.prototype.addTodo = function(text) {
  let id = String(Object.keys(listItems).length+1);
  listItems[id] = {id: id, text: text, status: 'open'};
  user.list.push(id);
  return listItems[id];
}

ObjectDao.prototype.editTodo = function(id, text, status) {
  if (id in listItems) {
    console.log('listItems[' + id + '] ' + JSON.stringify(listItems[id]));
    if (text && text !== null) {
      listItems[id].text = text;
    }
    else if (status && status !== null) {
      listItems[id].status = status;
    }
    else {
      console.log('Nothing to update!');
    }
    console.log('listItems[' + id + '] ' + JSON.stringify(listItems[id]));
  }
  else {
    console.log('Id: "' + JSON.stringify(id) + '" not found');
  }
  return listItems[id];
}

ObjectDao.prototype.deleteTodo = function(id) {
  if (id in listItems) {
    delete listItems[id];
    return true;
  }
  else {
    return false;
  }
}
