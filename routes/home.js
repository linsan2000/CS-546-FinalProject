import express from 'express';
const router = express.Router();
import { moviesData, usersData } from '../data/index.js';
import { isNumberString } from 'class-validator';
import helperMethods, { formatDate } from '../helpers.js'
import { reviews, movies } from '../config/mongoCollections.js';
import { getDurationStr } from '../data/movies.js';
/*home page */
router
    .route('/')
    .get(async (req, res) => {
        let page = isNumberString(req.query.page) ? parseInt(req.query.page) : 1;
        let limit = isNumberString(req.query.limit) ? parseInt(req.query.limit) : 5;
        let q = req.query.q;
        const user = req.session.user;
        const moviesPageData = await moviesData.getMoviePageList({
            page,
            limit,
            q
        });
        let moviesCollection = await movies()
        let total = await moviesCollection.find().count()
        let index = Math.floor(total * Math.random());

        if (total > 0) {
            let recommandation = await await moviesCollection.find().sort({
                title: 1
            }).skip(index).limit(1).toArray();
            recommandation[0].isRecommanded = true
            moviesPageData.data.unshift(recommandation[0])
        }
        return res.render('home', {
            user: user,
            moviesData: moviesPageData,
        });
    });
router
    .route('/movie/:id')
    .get(async (req, res) => {
        const user = req.session.user;
        try {
            let movie = await moviesData.getMovieById(req.params.id);
            if (!movie) {
                return res.status(404).render({
                    user: user,
                    error: 'Movie not found.'
                })
            }
            movie = {
                ...movie,
                duration: getDurationStr(movie.duration),
                dateReleased: formatDate(movie.dateReleased, 'dd/MM/yyyy'),
            }
            //get all reviews 
            const reviewsCollection = await reviews()
            try {
                let query = await reviewsCollection.aggregate([
                    {
                        $match: {
                            movieId: req.params.id,
                        }
                    }, {
                        $project: {
                            userId: { $toObjectId: "$userId" },
                            review: 1,
                            reviewDate: 1,
                            movieId: 1,
                            rating: 1
                        }
                    }, {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user_info'
                        }
                    }])
                let allReviews = (await query.toArray()).map(m => ({
                    review: m.review,
                    reviewDate: formatDate(m.reviewDate, 'dd/MM/yyyy hh:mm:ss'),
                    username: m.user_info[0]?.username ?? '',
                    rating: m.rating,
                    userId: m.userId.toString()
                }))
                //the review of current login user
                let currentUserReview = allReviews.find(m => m.userId === user?.userId)
                return res.render('detail', {
                    user: user,
                    movie: movie,
                    reviews: allReviews,
                    myReview: currentUserReview
                });
            } catch (e) {
                console.log(e)
            }
        }
        catch (e) {
            return res.status(400).render('error', {
                user: user,
                error: e
            })
        }
    });
/**login */
router.route('/login')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/')
        }
        else {
            res.render('user/login', {
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
            res.render('user/register', {
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