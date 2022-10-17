const ContactService = require('./contactService');
const AuthService = require('./authService');
const UserService = require('./userService');

module.exports = {
    ...ContactService,
    ...AuthService,
    ...UserService,
};
