import express from 'express';

import * as usersController from './usersController';

const router = express.Router();

router.get('/login', async () => usersController.login);
router.get('/create', async () => usersController.create);
router.post('/findAll', async () => usersController.findAll);

export default router;
