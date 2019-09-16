'user strict';

const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    let users = "";

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    });

    it('should add new users', () => {
        const allUsers = new Users();
        const user = {
            id: '123',
            name: 'Konstantin',
            room: 'The Office Fans'
        };
        //const responseUser = allUsers.addUser(user.id, user.name, user.room);

        expect(allUsers.users).toEqual([user]);
    });

    it('should find user', () => {
        const userId = '2';
        const user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        const userId = '99';
        const user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return names for node course', () => {
        const userList = users.getUserList('Node Course');

        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        const userList = users.getUserList('React Course');

        expect(userList).toEqual(['Jen']);
    });

    it('should remove a user', () => {
        const userId = '1';
        const user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        const userId = '99';
        const user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
});
