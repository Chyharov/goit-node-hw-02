const passwordRegEx =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;

const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const notValidCredentials = 'Email or password is wrong';

module.exports = {
    passwordRegEx,
    emailRegEx,
    notValidCredentials,
};
