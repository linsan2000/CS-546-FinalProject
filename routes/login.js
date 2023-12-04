import { Router } from 'express';
const router = Router();
import { moviesData, usersData, reviewsData } from '../data/index.js';
import helperMethods from '../helpers.js'

router.route('/')
	.get(async (req, res) => {
		return res.render('login');
	})
	.post(async (req, res) => {
		try {
			let loginInfo = req.body;
			let { emailAddressInput, passwordInput } = loginInfo;
			for (let [key, value] of Object.entries(loginInfo)) {
				if (value === undefined || value === null || value === '') {
					return res.status(400).render('login', { statusCode: 400, errorMessage: `${key} does not exist` });
				}
			}
			if (!helperMethods.isValidEmailAddress(emailAddressInput)) {
				return res.status(400).render('login', { statusCode: 400, errorMessage: 'Invalid email address.' });
			}
			if (!helperMethods.isValidPassword(passwordInput)) {
				return res.status(400).render('login', { statusCode: 400, errorMessage: 'Invalid password.' });
			}
			try {
				const user = await usersData.loginUser(emailAddressInput, passwordInput);
				if (user) {
					req.session.user = user;
					if (user.role === 'admin') {
						return res.redirect('/admin');
					} else if (user.role === 'user') {
						return res.redirect('/protected');
					}
				}
			} catch (error) {
				return res.status(400).render('login', { statusCode: 400, errorMessage: error });
			}
		} catch (error) {
			return res.status(500).render('login', { statusCode: 500, errorMessage: 'Internal Server Error' });
		}
	});

export default router;
