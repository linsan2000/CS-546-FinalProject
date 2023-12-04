import express from 'express';
const router = express.Router();
import { moviesData } from '../data/index.js';

router.route('/').get(async (req, res) => {
    const user = req.session.user;
    const isAdmin = user.role === 'admin';
    const movies = await moviesData.getAllMovies()

    return res.render('home', {
        username: user.username,
        isAdmin: isAdmin,
        movies: movies,
        currentTime: new Date().toLocaleTimeString()
    });
});

export default router;