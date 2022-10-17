const Joi = require('joi');
const { emailRegEx } = require('../constants');

const schema = Joi.object({
    email: Joi.string()
        .regex(emailRegEx)
        .message('Not a valid email')
        .required(),
});

module.exports = schema;
