const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const Contact = model('Contact', contactSchema);
// categories -> category
// mise -> mouse

module.exports = Contact;
