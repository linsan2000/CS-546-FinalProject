import { createMovie, getAllMovies, getMovieById, removeMovieById, updateMovieById } from '../data/movies.js'
import { createReview, getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, getReviewById, removeReviewById } from '../data/reviews.js'
import express from 'express';
const router = express.Router();
import helperMethods from '../helpers.js'


router
  .route('/')
  .get(async (req, res) => { // getAllMovies
    try {
      const movies = await getAllMovies()
      return res.status(200).json(movies);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => { // createMovie
    try {
      let movieInfo = getValidateMovieInstance(req.body)
      console.log(movieInfo)
      res.json({ success: true })
    }
    catch (e) {
      res.status(400).json({ error: e });
    }
  });

router
  .route('/:movieId')
  .get(async (req, res) => { // getMovieById
    try {
      let movieId = helperMethods.getValidId(req.params.movieId);
      const event = await getMovieById(movieId)
      return res.status(200).json(event);

    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => { // removeMovieById
    try {
      let movieId = helperMethods.getValidId(req.params.movieId);
      const event = await removeMovieById(movieId)
      return res.status(200).json(event);

    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .put(async (req, res) => { // updateMovieById
    try {
      let movieInfo = getValidateMovieInstance(req.data)
      console.log(movieInfo)
      res.json({ success: true })
    }
    catch (e) {
      res.status(400).json({ error: e });
    }
    //const data = req.body;
    // if (!data || Object.keys(data).length === 0) {
    //   return res.status(400).json({ error: 'There are no fields in the request body' });
    // }
    // try {
    //   let {
    //     titleValid, plotValid, MPA_FilmRatingsValid, studioValid, directorValid, dateReleasedValid, durationValid, overallRatingValid, imageUrlValid
    //   } = helperMethods.getValidMovie(
    //     data.title,
    //     data.plot,
    //     data.MPA_FilmRatings,
    //     data.studio,
    //     data.director,
    //     data.dateReleased,
    //     data.duration,
    //     data.overallRating,
    //     data.imageUrl
    //   )

    //   const newPost = await updateMovieById(helperMethods.getValidId(req.params.movieId),
    //     titleValid,
    //     plotValid,
    //     MPA_FilmRatingsValid,
    //     studioValid,
    //     directorValid,
    //     dateReleasedValid,
    //     durationValid,
    //     overallRatingValid,
    //     imageUrlValid);
    //   res.status(200).json(newPost);
    // } catch (e) {
    //   if (e.name === '404') {
    //     res.status(404).json({ error: e.message });
    //   } else if (e.message) {
    //     res.status(400).json({ error: e.message });
    //   } else res.status(400).json({ error: e });
    // }
  });

router
  .route('/:movieId/reviews')
  .get(async (req, res) => { // getAllReviewsByMovieId

    try {
      req.params.movieId = helperMethods.getValidId(req.params.movieId);
      const event = await getAllReviewsByMovieId(req.params.movieId)
      return res.status(200).json(event);

    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })


export default router;