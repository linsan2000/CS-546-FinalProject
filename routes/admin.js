import express from 'express';
const router = express.Router();
import { moviesData } from '../data/index.js';
import multer from 'multer';
import { isDate, isDateString, isInt, isNotEmpty, isNumberString, length } from 'class-validator';
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
    .route('/movies')
    .post(upload.single('file'), async (req, res) => {
        const user = req.session.user;
        const isAdmin = user.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({ error: 'You do not have permission to add movie' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' })
        }
        try {
            const movieInfo = getValidateMovieInstance(req.body)
            movieInfo.imageUrl = "/" + req.file.path
            const result = await moviesData.createMovie(movieInfo);
            res.json(result)
        } catch (error) {
            console.error(error)
            res.status(400).json({ error: error })
        }
    });

/**
 * validate date fields 
 * @param {*} data 
 * @returns a valid movie instance
 */
function getValidateMovieInstance(data) {
    if (!length(data?.title, 1, 100)) {
        throw 'the length of movie title is between 1 and 100.'
    }
    if (!length(data?.director, 1, 100)) {
        throw 'the length of movie director is between 1 and 100.'
    }
    if (!length(data?.studio, 1, 100)) {
        throw 'the length of movie studio is between 1 and 100.'
    }
    if (!isDateString(data?.dateReleased)) {
        throw 'dateReleased is invalid.'
    }
    if (!isNumberString(data?.duration)) {
        throw 'duration should be number.'
    }
    if (!length(data?.plot, 0, 1000)) {
        throw 'the length of movie plot is between 0 and 1000.'
    }
    return {
        title: data.title,
        director: data.director,
        studio: data.studio,
        dateReleased: new Date(data.dateReleased),
        duration: parseFloat(data.duration),
        plot: data.plot
    }
}

export default router;