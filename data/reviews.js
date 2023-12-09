import helperMethods from "../helpers.js";
import { reviews } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { createMovie, getAllMovies, getMovieById, removeMovieById, updateMovieById, getMoviePageList } from './movies.js'

const reviewsCollection = await reviews()

const createReview = async (movieId, userId, review, rating) => {
  userId = helperMethods.getValidId(userId)
  movieId = helperMethods.getValidId(movieId)
  let prevMovie = await getMovieById(movieId);
  const movie = await reviewsCollection.find({ movieId: movieId, userId: userId }).toArray()
  if (movie.length !== 0) {
    throw "review already exists with that movieId and userId"
  }
  let {
    reviewValid, ratingValid
  } = helperMethods.getValidReview(
    review, rating
  )
  const newReview = {
    movieId: movieId,
    userId: userId,
    reviewDate: new Date(),
    review: reviewValid,
    rating: ratingValid
  }
  const insertInfo = await reviewsCollection.insertOne(newReview)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add review'
  }
  /** Update rating for this movie */
  prevMovie.overallRating = (prevMovie.overallRating * prevMovie.numberOfRatings + ratingValid) / (prevMovie.numberOfRatings + 1);
  prevMovie.numberOfRatings = prevMovie.numberOfRatings + 1;
  updateMovieById(
    prevMovie._id,
    prevMovie.title,
    prevMovie.plot,
    prevMovie.studio,
    prevMovie.director,
    prevMovie.dateReleased,
    prevMovie.duration,
    prevMovie.overallRating,
    prevMovie.numberOfRatings,
    prevMovie.imageUrl)
  /** Return review detail */
  const newReviewId = insertInfo.insertedId.toString()
  const res = await getReviewById(newReviewId)
  return res
};

const getAllReviewsByMovieId = async (movieId) => {
  movieId = helperMethods.getValidId(movieId)
  const reviewList = await reviewsCollection.find({ movieId: movieId }).toArray()

  return reviewList
};

const getAllReviewsByUserId = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const reviewList = await reviewsCollection.find({ userId: userId }).toArray()

  return reviewList
};

const deleteAllReviewsByUserId = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const deletionInfo = await reviewsCollection.deleteMany({ userId: userId })
  if (!deletionInfo.acknowledged) {
    throw `Could not delete reviews with userId of ${userId}`
  }

  return {
    userId: userId,
    deleted: Boolean(true)
  }
}

const getReviewById = async (reviewId) => {
  reviewId = helperMethods.getValidId(reviewId)
  let review = await reviewsCollection.findOne({ _id: new ObjectId(reviewId) })
  if (review === null) {
    throw ' review do not exists with that reviewId'
  }

  review._id = review._id.toString()
  return review
};

const removeReviewById = async (reviewId) => {
  reviewId = helperMethods.getValidId(reviewId)
  let deletionInfo = await reviewsCollection.findOneAndDelete({
    _id: new ObjectId(reviewId)
  })
  if (!deletionInfo) {
    throw Object.assign(new Error(`Could not delete review with reviewId of ${reviewId}`), { name: '404' });
  }

  return {
    title: deletionInfo.title,
    deleted: Boolean(true)
  }
};

export { createReview, getAllReviewsByMovieId, getAllReviewsByUserId, deleteAllReviewsByUserId, getReviewById, removeReviewById }