import express from 'express';
const router = express.Router();
import { moviesData } from '../data/index.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
})

const upload = multer({ storage: storage })

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

router
    .route('/addMovie')
    .post(upload.single('movieImageInput'), async (req, res) => {
        const user = req.session.user;
        const isAdmin = user.role === 'admin';
        if (!isAdmin) {
            return res.status(403).render('publish', {
                statusCode: 403,
                errorMessage: 'You do not have permission to add movie'
            });
        }
        if (!req.file) {
            return res.status(400).render('publish', { statusCode: 400, errorMessage: 'No image uploaded' });
        }
        try {
            const imageUrl = `${req.file.path}`;
            const { titleInput, plotInput, MPA_FilmRatingsInput, studioInput, directorInput, dateReleasedInput, durationInput } = req.body;
            const result = await moviesData.createMovie(titleInput, plotInput, MPA_FilmRatingsInput, studioInput, directorInput, dateReleasedInput, durationInput, imageUrl);
            if (result.insertedMovie) {
                return res.redirect('/');
            }
        } catch (error) {
            return res.status(400).render('publish', { statusCode: 400, errorMessage: error });
        }
    });

export default router;