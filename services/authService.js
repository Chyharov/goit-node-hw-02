const { User } = require('../models');
const { createError, sendEmail } = require('../helpers');
const { notValidCredentials } = require('../constants');
const { jwtSecret, port } = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { v4: uuid } = require('uuid');

async function register(body) {
    const { email, password } = body;
    const user = await User.findOne({ email });

    if (user) {
        throw createError(409, 'Email is use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const verificationToken = uuid();
    const result = await User.create({
        email,
        password: hash,
        avatarURL: gravatar.url(email),
        verificationToken,
    });

    sendEmail({
        to: email,
        subject: 'Confirm email',
        html: `<a href="http://localhost:${port}/api/auth/users/verify/${verificationToken}">Confirm Email</a>`,
    });

    const { password: newUserPassword, ...newUser } = result.toObject();

    return newUser;
}

async function login(body) {
    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
        throw createError(401, notValidCredentials);
    }

    if (!user.verify) {
        throw createError(401, 'Email not verify');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw createError(401, notValidCredentials);
    }

    const { password: pass, ...existingUser } = user.toObject();
    const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '7 days',
    });
    await User.findByIdAndUpdate(user.id, { token }, { new: true });

    return {
        user: existingUser,
        token,
    };
}

async function logout(id) {
    await User.findByIdAndUpdate(id, { token: '' });
}

async function userToken(token) {
    return User.findOne(token);
}

async function confirmEmail(verificationToken) {
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw createError(404, 'User not found');
    }

    if (user.verify) {
        throw createError(400, 'Verification has already been passed');
    }

    await User.findByIdAndUpdate(user.id, {
        verificationToken: null,
        verify: true,
    });
}

async function resendEmail(email) {
    const user = await User.findOne({ email });

    if (!user) {
        throw createError(404, 'User not found');
    }

    if (user.verify) {
        throw createError(400, 'Verification has already been passed');
    }

    sendEmail({
        to: email,
        subject: 'Confirm email',
        html: `<a href="http://localhost:${port}/api/auth/users/verify/${user.verificationToken}">Confirm Email</a>`,
    });
}

module.exports = {
    register,
    login,
    logout,
    userToken,
    confirmEmail,
    resendEmail,
};
