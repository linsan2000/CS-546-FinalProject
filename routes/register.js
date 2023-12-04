import { Router } from 'express';
const router = Router();
import { usersData } from '../data/index.js';
import helperMethods from '../helpers.js';

router.route('/')
	.get(async (req, res) => {
		res.render('register');
	})
	.post(async (req, res) => {
		try {
			let registerInfo = req.body;
			let { usernameInput, emailAddressInput, passwordInput, confirmPasswordInput, roleInput } = registerInfo;
			for (let [key, value] of Object.entries(registerInfo)) {
				if (value === undefined || value === null || value === '') {
					return res.status(400).render('register', { statusCode: 400, errorMessage: `${key} does not exist` });
				}
			}
			if (!helperMethods.isValidUsername(usernameInput)) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: 'Invalid username.' });
			}
			if (!helperMethods.isValidEmailAddress(emailAddressInput)) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: 'Invalid email address.' });
			}
			if (!helperMethods.isValidPassword(passwordInput)) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: 'Invalid password.There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character, and should be a minimum of 8 characters long' });
			}
			if (passwordInput !== confirmPasswordInput) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: 'Passwords do not match.' });
			}
			if (!helperMethods.isValidRole(roleInput)) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: 'Invalid role.' });
			}
			try {
				const result = await usersData.registerUser(usernameInput, emailAddressInput, passwordInput, roleInput);
				if (result.insertedUser) {
					return res.redirect('/login');
				}
			} catch (error) {
				return res.status(400).render('register', { statusCode: 400, errorMessage: error });
			}
		} catch (error) {
			return res.status(500).render('register', { statusCode: 500, errorMessage: 'Internal Server Error' });
		}
	});

export default router;
