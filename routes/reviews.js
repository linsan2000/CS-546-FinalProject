import { createReview, getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, getReviewById, removeReviewById } from '../data/reviews.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

//getAllReviewsByUserId, deleteAllReviewsByUserId
router
  .route('/:reviewId')
  .get(async (req, res) => { // getReviewById
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    try {
      req.params.reviewId = helpers.checkId(req.params.reviewId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const event = await reviewData.getAllAttendees(req.params.reviewId)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  })
  .post(async (req, res) => {  // createReview
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      const { firstName, lastName, emailAddress } = data;
      const event = await reviewData.createAttendee(req.params.reviewId, firstName, lastName, emailAddress)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  });

router
  .route('/review/:reviewId')
  .delete(async (req, res) => { // removeReviewById
    try {
      req.params.reviewId = helpers.checkId(req.params.reviewId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const event = await reviewData.removeReviewById(req.params.reviewId)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  });

export default router;