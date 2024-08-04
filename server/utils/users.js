"user strict";

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room, colors) {
    const user = { id, name, room, colors };
    this.users.push(user);
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    const users = this.users.filter((user) => user.room === room);
    // const namesArray = users.map((user) => user.name);
    const namesArray = users.map((user) => ({
      name: user.name,
      colors: user.colors,
    }));

    return namesArray;
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) this.users = this.users.filter((user) => user.id !== id);

    return user;
  }
}

module.exports = { Users };
