import express from 'express';
const router = express.Router();
import { moviesData, usersData } from '../data/index.js';
import { isNumberString } from 'class-validator';
import helperMethods from '../helpers.js'
/*home page */
router
    .route('/')
    .get(async (req, res) => {
        let page = isNumberString(req.query.page) ? parseInt(req.query.page) : 1;
        let limit = isNumberString(req.query.limit) ? parseInt(req.query.limit) : 10;
        const user = req.session.user;
        const isAdmin = user?.role === 'admin';
        const movies = await moviesData.getMoviePageList({
            page,
            limit
        });
        console.log(movies)
        return res.render('home', {
            user: user,
            isAdmin: isAdmin,
            moviesData: movies,
        });
    });

/**login */
router.route('/login')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/')
        }
        else {
            res.render('login', {
                isLoginPage: true
            });
        }
    })
    .post(async (req, res) => {
        try {
            let { email, password } = req.body;

            if (!helperMethods.isValidEmailAddress(email)) {
                return res.status(400).json({ error: 'Invalid email address.' })
            }
            if (!helperMethods.isValidPassword(password)) {
                return res.status(400).json({ error: 'Invalid password.' })
            }
            try {
                const user = await usersData.loginUser(email, password);
                if (user) {
                    req.session.user = user;
                    return res.json({ success: true })
                }
            } catch (error) {
                return res.status(400).json({
                    error: error
                })
            }
        } catch (error) {
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    });

/**logout  */
router.route('/logout')
    .get(async (req, res) => {
        if (req.session.user) {
            req.session.destroy();
            res.redirect('/');
        } else {
            res.redirect('/login')
        }

    });

/**register */
router.route('/register')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/')
        }
        else {
            res.render('register', {
                isLoginPage: true
            });
        }
    })
    .post(async (req, res) => {
        try {
            let registerInfo = req.body;
            let { username, email, password, password2, role } = registerInfo;
            for (let [key, value] of Object.entries(registerInfo)) {
                if (value === undefined || value === null || value === '') {
                    return res.status(400).json({ error: `${key} does not exist` })
                }
            }
            if (!helperMethods.isValidUsername(username)) {
                return res.status(400).json({ error: 'Invalid username.' })
            }
            if (!helperMethods.isValidEmailAddress(email)) {
                return res.status(400).json({ error: 'Invalid email address.' })
            }
            if (!helperMethods.isValidPassword(password)) {
                return res.status(400).json({ error: '' })
            }
            if (password !== password2) {
                return res.status(400).json({ error: 'Passwords do not match.' })
            }
            if (!helperMethods.isValidRole(role)) {
                return res.status(400).json({ error: 'Invalid role.' })
            }
            try {
                const result = await usersData.registerUser(username, email, password, role);
                return res.json({ success: true })
            } catch (error) {
                return res.status(400).json({ error: error })
            }
        } catch (error) {
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    });

export default router;