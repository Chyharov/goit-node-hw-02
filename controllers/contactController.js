const { Router } = require('express');
const {
    createContact,
    getContactById,
    getContacts,
    removeContact,
    updateContact,
    updateStatusContact,
} = require('../services');
const {
    createContactSchema,
    objectIdSchema,
    updateStatusContactSchema,
} = require('../schemas');

const router = Router();

router.get('/', async function (req, res, next) {
    try {
        const contacts = await getContacts();

        res.json(contacts);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { error } = createContactSchema.validate(req.body);

        if (error) {
            console.error(error);
            next(error);
        }

        const contact = await createContact(req.body);

        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const { error } = objectIdSchema.validate(req.params.id);

        if (error) {
            console.error(error);
            next(error);
        }

        const contact = await getContactById(req.params.id);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const { error } = objectIdSchema.validate(req.params.id);

        if (error) {
            console.error(error);
            next(error);
        }

        await removeContact(req.params.id);

        res.status(203).json();
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const { error: idError } = objectIdSchema.validate(req.params.id);

        if (idError) {
            console.error(idError);
            next(idError);
        }

        const { error: bodyError } = createContactSchema.validate(req.body);

        if (bodyError) {
            console.error(bodyError);
            next(bodyError);
        }

        const contact = await updateContact(req.params.id, req.body);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/favorite', async function (req, res, next) {
    try {
        const { error: idError } = objectIdSchema.validate(req.params.id);

        if (idError) {
            console.error(idError);
            next(idError);
        }

        const { error: bodyError } = updateStatusContactSchema.validate(
            req.body
        );

        if (bodyError) {
            console.error(bodyError);
            next(bodyError);
        }

        const contact = await updateStatusContact(req.params.id, req.body);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
