import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import { moviesData, usersData, reviewsData } from '../data/index.js';

router.route('/')
.get(async (req, res) => {
	res.render('register',{title: 'Register Page'})
  })
.post(async (req, res) => {
	try{
		let responseUser = usersData.registerUser(req.body.username, 
            req.body.password,
            req.body.email, 
            false);
		res.redirect('/login');
	}catch(e){
		res.status(400).json({error:e})
	}
});

export default router;
