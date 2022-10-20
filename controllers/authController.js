const { Router } = require('express');
const { validateSchema, createError } = require('../helpers');
const { registerSchema, loginSchema, emailResetSchema } = require('../schemas');
const {
    register,
    login,
    logout,
    userToken,
    confirmEmail,
    resendEmail,
} = require('../services');
const { checkAuth } = require('../middlewares');

const router = Router();

router.post('/users/signup', async (req, res, next) => {
    try {
        validateSchema(registerSchema, req.body);

        const user = await register(req.body);
        // const { password, ...user } = result.toObject();

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/users/login', async (req, res, next) => {
    try {
        validateSchema(loginSchema, req.body);

        const result = await login(req.body);

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.patch('/users/logout', checkAuth, async (req, res, next) => {
    try {
        const { user } = req;
        await logout(user.id);

        res.status(204).json({ message: 'No Content' });
    } catch (error) {
        next(error);
    }
});

router.get('/users/current', checkAuth, async (req, res, next) => {
    try {
        const { user } = req;
        const { authorization = '' } = req.headers;
        const token = authorization.split(' ')[1];

        if (token !== user.token) {
            throw createError(401, 'Not authorized');
        }

        const result = await userToken({ token });
        const {
            password,
            token: currentToken,
            ...existUser
        } = result.toObject();
        const currentUser = {
            user: existUser,
        };

        res.status(200).json(currentUser);
    } catch (err) {
        next(err);
    }
});

router.get('/users/verify/:verificationToken', async (req, res, next) => {
    try {
        await confirmEmail(req.params.verificationToken);

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        next(error);
    }
});

router.post('/users/verify/', async (req, res, next) => {
    try {
        validateSchema(emailResetSchema, req.body);

        await resendEmail(req.body.email);

        res.json({ message: 'Verification email sent' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
