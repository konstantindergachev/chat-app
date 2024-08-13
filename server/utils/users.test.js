"user strict";

const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  let users = "";

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "Node Course",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
      {
        id: "2",
        name: "Jen",
        room: "React Course",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
      {
        id: "3",
        name: "Julie",
        room: "Node Course",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
    ];
  });

  it("should add new users", () => {
    const allUsers = new Users();
    const user = {
      id: "123",
      name: "Konstantin",
      room: "The Office Fans",
      colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
    };
    const responseUser = allUsers.addUser(
      user.id,
      user.name,
      user.room,
      user.colors
    );

    expect(allUsers.users[0]).toEqual(responseUser);
  });

  it("should find user", () => {
    const userId = "2";
    const user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should not find user", () => {
    const userId = "99";
    const user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it("should return names for node course", () => {
    const userList = users.getUserList("Node Course");

    expect(userList).toEqual([
      {
        name: "Mike",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
      {
        name: "Julie",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
    ]);
  });

  it("should return names for react course", () => {
    const userList = users.getUserList("React Course");

    expect(userList).toEqual([
      {
        name: "Jen",
        colors: { backgroundColor: "#FFFFFF", textColor: "#000000" },
      },
    ]);
  });

  it("should remove a user", () => {
    const userId = "1";
    const user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove user", () => {
    const userId = "99";
    const user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });
});
