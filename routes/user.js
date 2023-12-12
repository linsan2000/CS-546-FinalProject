import express from 'express';
import { ObjectId } from 'mongodb'
const router = express.Router();
import helperMethods, { formatDate } from '../helpers.js';
import { reviews, users } from '../config/mongoCollections.js';
import { createReview, getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, getReviewById, removeReviewById } from '../data/reviews.js'
import { getEncodedPwd } from '../data/users.js';
router
  .route('/reviews')
  .get(async (req, res) => {
    const reviewsCollection = await reviews()
    let query = await reviewsCollection.aggregate([
      {
        $match: {
          userId: req.session.user.userId,
        }
      }, {
        $project: {
          movieId: { $toObjectId: "$movieId" },
          review: 1,
          reviewDate: 1,
          rating: 1
        }
      }, {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie_info'
        }
      }])
    let allReviews = (await query.toArray()).map(m => ({
      review: m.review,
      reviewDate: formatDate(m.reviewDate, 'dd/MM/yyyy hh:mm:ss'),
      title: m.movie_info[0]?.title ?? '',
      rating: m.rating,
      movieId: m.movieId.toString(),
    }))
    return res.render('user/reviews', {
      reviews: allReviews,
      user: req.session.user
    })
  })
router
  .route('/account')
  .get(async (req, res) => {
    return res.render('user/account', {
      user: req.session.user
    })
  }).post(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      if (!helperMethods.isValidUsername(username)) {
        return res.status(400).json({ error: 'Invalid username.' })
      }
      if (!helperMethods.isValidEmailAddress(email)) {
        return res.status(400).json({ error: 'Invalid email address.' })
      }
      if (password && !helperMethods.isValidPassword(password)) {
        return res.status(400).json({ error: '' })
      }
      try {
        const userCollections = await users()
        let fields = {
          username: username,
          emailAddress: email
        }
        if (password) {
          fields.password = await getEncodedPwd(password)
        }
        await userCollections.updateOne({
          _id: new ObjectId(req.session.user.userId)
        }, {
          $set: fields
        })
        req.session.user = {
          ...req.session.user,
          ...fields
        }
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
router
  .route('/review')
  .post(async (req, res) => {  // createReview
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body' });
    }
    try {
      let userId = req.session.user.userId;
      let { movieId, review, rating } = data;
      userId = helperMethods.getValidId(userId);
      movieId = helperMethods.getValidId(movieId);
      let {
        reviewValid, ratingValid
      } = helperMethods.getValidReview(
        review, rating
      )
      await createReview(movieId, userId, reviewValid, ratingValid)
      return res.status(200).json({ success: true });
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })

router
  .route('/review/:reviewId')
  .get(async (req, res) => { // getReviewById
    try {
      const event = await getReviewById(helperMethods.getValidId(req.params.reviewId))
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {  // removeReviewById
    try {
      const event = await removeReviewById(helperMethods.getValidId(req.params.reviewId))
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })

router
  .route('/reviews/:userId')
  .get(async (req, res) => {  // getAllReviewsByUserId
    try {
      const event = await getAllReviewsByUserId(helperMethods.getValidId(req.params.userId))
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {   // deleteAllReviewsByUserId
    try {
      const event = await deleteAllReviewsByUserId(helperMethods.getValidId(req.params.userId))
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  });



export default router;