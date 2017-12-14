import express from 'express';

import * as tagsController from './tagsController';
import { authMiddleware, restrictTo } from '../../middleware/auth';
import config from '../../config/index';

const router = express.Router();
const ADMIN = config.roles.ADMIN;
const USER = config.roles.USER;

router.use(authMiddleware);

router.post('/add', restrictTo(ADMIN, USER), async (req, res) => tagsController.add(req, res));
router.put('/remove', restrictTo(ADMIN, USER), async (req, res) => tagsController.remove(req, res));
router.get('/findOne/:tag', restrictTo(ADMIN, USER), async (req, res) => tagsController.findOne(req, res));
router.get('/findByCreator/:creator', restrictTo(ADMIN, USER), async (req, res) => tagsController.findByCreator(req, res));
router.get('/findAll', restrictTo(ADMIN, USER), async (req, res) => tagsController.findAll(req, res));

export default router;
