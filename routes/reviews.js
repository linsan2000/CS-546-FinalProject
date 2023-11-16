import { reviewData } from '../data/reviews.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

//getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, removeReviewById
router
  //getReviewById
  .route('/:reviewId')
  .get(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    try {
      req.params.eventId = helpers.checkId(req.params.eventId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const event = await attendeeData.getAllAttendees(req.params.eventId)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  })
  //createReview
  .post(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      const { firstName, lastName, emailAddress } = data;
      const event = await attendeeData.createAttendee(req.params.eventId, firstName, lastName, emailAddress)
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
  .get(async (req, res) => {
    //code here for GET
  })
  .delete(async (req, res) => {
    //code here for DELETE
  });