import express from 'express';

import * as usersController from './usersController';

const router = express.Router();

router.post('/signIn', async (req, res) => usersController.signIn(req, res));
router.post('/signUp', async (req, res) => usersController.signUp(req, res));
router.get('/findAll', async (req, res) => usersController.findAll(req, res));

export default router;
