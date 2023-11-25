import { registerUser, getAllUsers, getUserById, removeUserById, updateUserById, login } from '../data/users.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    res.render('user',{user: req.session.user, title:"Account Detail"});
  });

export default router;