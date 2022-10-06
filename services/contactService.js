const { Contact } = require('../models');
const { createError } = require('../helpers');

async function createContact(body) {
    return Contact.create(body);
}

async function getContactById(id) {
    const contact = await Contact.findById(id);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    return contact;
}

async function getContacts() {
    return await Contact.find();
}

async function removeContact(id) {
    await getContactById(id);
    const removeContact = await Contact.findByIdAndDelete(id);
    console.log(removeContact);
}

async function updateContact(id, body) {
    await getContactById(id);

    return Contact.findByIdAndUpdate(id, body, { new: true });
}

async function updateStatusContact(id, body) {
    await getContactById(id);

    return Contact.findByIdAndUpdate(id, body, { new: true });
}

module.exports = {
    createContact,
    getContactById,
    getContacts,
    removeContact,
    updateContact,
    updateStatusContact,
};
