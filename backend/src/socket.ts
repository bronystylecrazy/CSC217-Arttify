const socketio = {
    instance: null,
    users: [],
    setUsers(users) {
        this.users = users;
    },
    setUser(user) {
        this.users.push(user);
    },
    removeUser(id) {
        this.users = this.users.filter(user => user.id !== id);
    },
    getUsers() {
        return this.users;
    },
    getUser(id) {
        return this.users.find(user => user.id === id)?.socket;
    },
    setSocket(io) {
        this.instance = io;
    },
    getInstance() {
        return this.instance;
    }
};

export default socketio;