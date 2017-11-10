import express from 'express';

import * as usersController from './usersController';
import { authMiddleware, restrictTo } from '../../middleware/auth';
import config from '../../config';

const router = express.Router();
const ADMIN = config.roles.ADMIN;
const USER = config.roles.USER;
const VISITOR = config.roles.VISITOR;

router.use(authMiddleware);

router.post('/signIn', restrictTo(VISITOR), async (req, res) => usersController.signIn(req, res));
router.post('/signUp', restrictTo(VISITOR), async (req, res) => usersController.signUp(req, res));
router.post('/update/:login', restrictTo(ADMIN, USER), async (req, res) => usersController.update(req, res));
router.get('/findOne/:login', restrictTo(ADMIN, USER), async (req, res) => usersController.findOne(req, res));
router.get('/findAll', restrictTo(ADMIN, USER), async (req, res) => usersController.findAll(req, res));

export default router;
