import express from 'express';

import * as usersController from './usersController';
import { authMiddleware, restrictTo } from '../../middleware/auth';
import config from '../../config/index';

const router = express.Router();
const ADMIN = config.roles.ADMIN;
const USER = config.roles.USER;
const VISITOR = config.roles.VISITOR;

router.use(authMiddleware);

router.post('/signIn', restrictTo(VISITOR), async (req, res) => usersController.signIn(req, res));
router.post('/signUp', restrictTo(VISITOR), async (req, res) => usersController.signUp(req, res));
router.post('/update/:_id', restrictTo(ADMIN, USER), async (req, res) => usersController.update(req, res));
router.post('/updateLikes', restrictTo(ADMIN, USER), async (req, res) => usersController.updateLikes(req, res));
router.post('/updateDislikes', restrictTo(ADMIN, USER), async (req, res) => usersController.updateDislikes(req, res));
router.get('/remove/:_id', restrictTo(ADMIN), async (req, res) => usersController.remove(req, res));
router.get('/updateScore/:_id/:action', restrictTo(ADMIN, USER), async (req, res) => usersController.updateScore(req, res));
router.get('/findById/:_id', restrictTo(ADMIN, USER), async (req, res) => usersController.findById(req, res));
router.get('/findByLogin/:login', restrictTo(ADMIN, USER), async (req, res) => usersController.findByLogin(req, res));
router.get('/findAll', restrictTo(ADMIN, USER), async (req, res) => usersController.findAll(req, res));
router.get('/findMatchs/:_id', restrictTo(ADMIN, USER), async (req, res) => usersController.findMatchs(req, res));
router.get('/findByAffinity/:_id', restrictTo(ADMIN, USER), async (req, res) => usersController.findByAffinity(req, res));
router.get('/sendResetEmail/:login', restrictTo(VISITOR), async (req, res) => usersController.sendResetEmail(req, res));
router.post('/resetPassword/:_id', restrictTo(VISITOR), async (req, res) => usersController.resetPassword(req, res));
router.post('/report', restrictTo(ADMIN, USER), async (req, res) => usersController.report(req, res));
router.post('/deleteNotification/:_id', restrictTo(ADMIN, USER), async (req, res) => usersController.deleteNotification(req, res));

export default router;
