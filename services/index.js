const UserService = require('./contactService');
const AuthService = require('./authService');

module.exports = {
    ...UserService,
    ...AuthService,
};
