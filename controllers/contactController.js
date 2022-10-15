const { Router } = require('express');
const {
    createContact,
    getContactById,
    getContacts,
    removeContact,
    updateContact,
} = require('../services');
const {
    createContactSchema,
    objectIdSchema,
    updateStatusContactSchema,
} = require('../schemas');
const { validateSchema } = require('../helpers');
const { checkAuth } = require('../middlewares');

const router = Router();

router.get('/', checkAuth, async function (req, res, next) {
    try {
        const { limit, offset } = req.query;
        const contacts = await getContacts({
            owner: req.user.id,
            limit,
            offset,
        });

        res.json(contacts);
    } catch (error) {
        next(error);
    }
});

router.post('/', checkAuth, async function (req, res, next) {
    try {
        const { user } = req;

        validateSchema(createContactSchema, req.body);

        const contact = await createContact({ ...req.body, owner: user.id });

        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        validateSchema(objectIdSchema, req.params.id);

        const contact = await getContactById(req.params.id);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        validateSchema(objectIdSchema, req.params.id);

        await removeContact(req.params.id);

        res.status(203).json();
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        validateSchema(objectIdSchema, req.params.id);

        validateSchema(createContactSchema, req.body);

        const contact = await updateContact(req.params.id, req.body);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/favorite', async function (req, res, next) {
    try {
        validateSchema(objectIdSchema, req.params.id);

        validateSchema(updateStatusContactSchema, req.body);

        const contact = await updateContact(req.params.id, req.body);

        res.json(contact);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
