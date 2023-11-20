import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import { moviesData, usersData, reviewsData } from '../data/index.js';

router.post('/', async (req, res) => {
  /*get req.body username and password
	const { username, password } = req.body;
	here, you would get the user from the db based on the username, then you would read the hashed pw
	and then compare it to the pw in the req.body
	let match = bcrypt.compare(password, 'HASHED_PW_FROM DB');
	if they match then set req.session.user and then redirect them to the private page
	 I will just do that here */
  req.session.user = {firstName: 'Patrick', lastName: 'Hill', userId: 123};//test
  res.redirect('/users');
});

export default router;
