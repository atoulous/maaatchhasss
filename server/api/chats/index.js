import express from 'express';

import * as chatsController from './chatsController';
import { authMiddleware, restrictTo } from '../../middleware/auth';
import config from '../../config/index';

const router = express.Router();
const ADMIN = config.roles.ADMIN;
const USER = config.roles.USER;

router.use(authMiddleware);

router.post('/add', restrictTo(ADMIN, USER), async (req, res) => chatsController.add(req, res));
router.put('/remove', restrictTo(ADMIN, USER), async (req, res) => chatsController.remove(req, res));
router.get('/findAllOf/:id', restrictTo(ADMIN, USER), async (req, res) => chatsController.findAllOf(req, res));

export default router;
