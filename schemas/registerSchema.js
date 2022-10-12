const Joi = require('joi');
const { emailRegEx, passwordRegEx } = require('../constants');

const schema = Joi.object({
    email: Joi.string().regex(emailRegEx).message('Not valid email').required(),
    // password: Joi.string()
    //     .regex(passwordRegEx)
    //     .message('Not valid password')
    //     .required(),
    password: Joi.string().required(),
});

module.exports = schema;
