import { createReview, getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, getReviewById, removeReviewById } from '../data/reviews.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'
router
  .route('/')
  .post(async (req, res) => {  // createReview
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body' });
    }

    try {
      let { movieId, userId, reviewTitle, reviewDate, review, rating } = data;
      userId = helpers.getValidId(userId);
      movieId = helpers.getValidId(movieId);
      let {
        reviewTitleValid, reviewDateValid, reviewValid, ratingValid
      } = helpers.getValidReview(
        reviewTitle, reviewDate, review, rating
      )
      const event = await createReview(movieId, userId, reviewTitleValid, reviewDateValid, reviewValid, ratingValid)
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
  .route('/:reviewId')
  .get(async (req, res) => { // getReviewById
    try {
      const event = await getReviewById(helpers.getValidId(req.params.reviewId))
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
      const event = await removeReviewById(helpers.getValidId(req.params.reviewId))
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
  .route('/user/:userId')
  .get(async (req, res) => {  // getAllReviewsByUserId
    try {
      const event = await getAllReviewsByUserId(helpers.getValidId(req.params.userId))
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
      const event = await deleteAllReviewsByUserId(helpers.getValidId(req.params.userId))
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