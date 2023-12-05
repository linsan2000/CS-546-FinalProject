import express from 'express';
const router = express.Router();
import { moviesData } from '../data/index.js';

router
    .route('/')
    .get(async (req, res) => {
        const user = req.session.user;
        const isAdmin = user.role === 'admin';
        const movies = await moviesData.getAllMovies();
        return res.render('home', {
            user: user,
            isAdmin: isAdmin,
            movies: movies,
            currentTime: new Date().toLocaleTimeString()
        });
    });

router
    .route('/publish')
    .get(async (req, res) => {
        const user = req.session.user;
        const isAdmin = user.role === 'admin';
        return res.render('publish', {
            user: user
        });
    });

export default router;