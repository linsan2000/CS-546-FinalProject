import { movieData } from '../data/index.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

router
  .route('/')
  .get(async (req, res) => {
    try {
      const movies = await movieData.getAll()
      return res.status(200).json(movies);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  })
  .post(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      const { title,
        plot,
        MPA_FilmRatings,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        imageUrl } = data;
      const newPost = await movieData.create(title,
        plot,
        MPA_FilmRatings,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        imageUrl);
      res.status(200).json(newPost);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

router
  .route('/:movieId')
  .get(async (req, res) => {
    try {
      req.params.eventId = helpers.checkId(req.params.eventId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const event = await eventData.get(req.params.eventId)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.eventId = helpers.checkId(req.params.eventId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const event = await eventData.remove(req.params.eventId)
      return res.status(200).json(event);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  })
  .put(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    try {
      const { movieId,
        title,
        plot,
        MPA_FilmRatings,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        imageUrl } = data;
      const newPost = await eventData.update(movieId,
        title,
        plot,
        MPA_FilmRatings,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        imageUrl);
      res.status(200).json(newPost);
    } catch (e) {
      if (e == "No dog with that id") {
        return res.status(404).json({ error: e });
      } else {
        return res.status(400).json({ error: e });
      }
    }
  });

export default router;