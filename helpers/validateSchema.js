const createError = require('./createError');

function validateSchema(schema, target) {
    const { error } = schema.validate(target);

    if (error) {
        console.error(error);

        throw new createError(
            400,
            'Ошибка от Joi или другой библиотеки  валидации'
        );
    }
}

module.exports = validateSchema;
