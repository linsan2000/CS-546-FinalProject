import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import { moviesData, usersData, reviewsData } from '../data/index.js';

router.route('/')
.get(async (req, res) => {
	res.render('login',{title: 'Login Page'})
  })
.post(async (req, res) => {
	try{
		let responseUser = usersData.login(req.body.username, req.body.password);
		req.session.user = responseUser;
		res.redirect('/users');
	}catch(e){
		res.status(400).json({error:"Invalid usernamd or password"})
	}
});

export default router;
