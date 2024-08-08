const expect = require("expect");
const io = require("socket.io-client");
const { CHAT_JOIN_ERROR, ADMIN_ROLE, ADMIN_VALUE } = require("../constants");

const socketURL = "http://localhost:9000";

describe("Chat Module", function () {
  let clientSocket;
  const options = {
    transports: ["websocket"],
    "force new connection": true,
    timeout: 5000, // Increase socket connection timeout
  };

  beforeEach(function (done) {
    clientSocket = io(socketURL, options);
    clientSocket.on("connect", () => {
      done();
    });
    clientSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      done(error);
    });
  });

  afterEach(function (done) {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  describe("Joining a chat", () => {
    it("should emit error for invalid name or room", (done) => {
      clientSocket.emit("join", { name: "", room: "" }, (error) => {
        expect(error).toBe(CHAT_JOIN_ERROR);
        done();
      });
    });

    it("should emit updateUserList and newMessage on successful join", (done) => {
      const params = { name: "TestUser", room: "TestRoom" };
      clientSocket.emit("join", params, () => {});

      let updateUserListCalled = false;
      let newMessageCalled = false;

      clientSocket.on("updateUserList", (users, name) => {
        expect(users.length).toBe(1);
        expect(users[0].name).toBe(params.name);
        expect(name).toBe(params.name);
        updateUserListCalled = true;
        if (updateUserListCalled && newMessageCalled) done();
      });

      clientSocket.on("newMessage", (message) => {
        expect(message.from).toBe(ADMIN_ROLE);
        expect(message.text).toBe(ADMIN_VALUE);
        newMessageCalled = true;
        if (updateUserListCalled && newMessageCalled) done();
      });
    });

    it("should handle multiple users joining the same room", (done) => {
      const clientSocket2 = io(socketURL, options);
      let joinCount = 0;

      const checkDone = () => {
        joinCount++;
        if (joinCount === 2) {
          clientSocket2.disconnect();
          done();
        }
      };

      clientSocket.emit("join", { name: "User1", room: "TestRoom" }, checkDone);
      clientSocket2.emit(
        "join",
        { name: "User2", room: "TestRoom" },
        checkDone
      );
    });
  });

  describe("Creating messages", () => {
    it("should emit newMessage to all users in the room", (done) => {
      const params = { name: "TestUser", room: "TestRoom" };
      const messageText = "Test message";

      clientSocket.emit("join", params, () => {
        clientSocket.emit("createMessage", { text: messageText }, () => {});
      });

      clientSocket.on("newMessage", (message) => {
        if (message.from === `${params.name}:`) {
          expect(message.text).toBe(messageText);
          done();
        }
      });
    });

    it("should not emit newMessage for empty text", (done) => {
      const params = { name: "TestUser", room: "TestRoom" };

      clientSocket.emit("join", params, () => {
        let newMessageReceived = false;

        clientSocket.on("newMessage", () => {
          newMessageReceived = true;
        });

        clientSocket.emit("createMessage", { text: "" }, () => {
          setTimeout(() => {
            expect(newMessageReceived).toBe(false);
            done();
          }, 100);
        });
      });
    });
  });

  describe("Creating location messages", () => {
    it("should emit newLocationMessage to all users in the room", (done) => {
      const params = { name: "TestUser", room: "TestRoom" };
      const coords = { latitude: 40.7128, longitude: -74.006 };

      clientSocket.emit("join", params, () => {
        clientSocket.emit("createLocationMessage", coords);
      });

      clientSocket.on("newLocationMessage", (message) => {
        expect(message.from).toBe(params.name);
        expect(message.url).toContain(coords.latitude.toString());
        expect(message.url).toContain(coords.longitude.toString());
        done();
      });
    });
  });

  describe("Handling disconnects", () => {
    const users = ["User1", "User2", "User3"];

    it("should emit updateUserList and newMessage on user disconnect", async function () {
      const clientSocket2 = io(socketURL, options);

      // Function to create a Promise for joining
      const joinRoom = (socket, name) => {
        return new Promise((resolve) => {
          socket.emit("join", { name, room: "TestRoom" }, resolve);
        });
      };

      // Join both users to the room
      await joinRoom(clientSocket, users[0]);
      await joinRoom(clientSocket2, users[1]);

      // Create promises for the expected events
      const updateUserListPromise = new Promise((resolve) => {
        clientSocket2.once("updateUserList", (chatters) => {
          expect(chatters[0].name).toEqual(users[1]);
          resolve();
        });
      });

      const newMessagePromise = new Promise((resolve) => {
        clientSocket2.once("newMessage", (message) => {
          expect(message.text).toBe(`${users[0]} ушёл`);
          resolve();
        });
      });

      // Disconnect the first user
      clientSocket.disconnect();

      // Wait for both events to occur
      await Promise.all([updateUserListPromise, newMessagePromise]);

      clientSocket2.disconnect();
    });

    it("should handle multiple users disconnecting", async function () {
      const clientSocket2 = io(socketURL, options);
      const clientSocket3 = io(socketURL, options);

      // Function to create a Promise for joining
      const joinRoom = (socket, name) => {
        return new Promise((resolve) => {
          socket.emit("join", { name, room: "TestRoom" }, resolve);
        });
      };

      // Join all users to the room
      await joinRoom(clientSocket, users[0]);
      await joinRoom(clientSocket2, users[1]);
      await joinRoom(clientSocket3, users[2]);

      // Create promises for the expected events
      const updateUserListPromises = [
        new Promise((resolve) => {
          clientSocket3.once("updateUserList", (chatters) => {
            expect(chatters.length).toNotEqual(users.length);
            resolve();
          });
        }),
        new Promise((resolve) => {
          clientSocket3.once("updateUserList", (chatters) => {
            expect(chatters.length).toNotEqual(users.length);
            resolve();
          });
        }),
      ];

      // Disconnect two users
      clientSocket.disconnect();
      clientSocket2.disconnect();

      // Wait for both updateUserList events to occur
      await Promise.all(updateUserListPromises);

      clientSocket3.disconnect();
    });
  });
});
