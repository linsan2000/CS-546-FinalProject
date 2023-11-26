import helperMethods from "../helpers.js";
import { reviews } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const reviewsCollection = await reviews()

const createReview = async (movieId, userId, reviewTitle, reviewDate, review, rating) => {
  userId = helperMethods.getValidId(userId)
  movieId = helperMethods.getValidId(movieId)
  const movie = await reviewsCollection.find({ movieId: movieId, userId: userId }).toArray()
  if (movie.length !== 0) {
    throw "review already exists with that movieId and userId"
  }
  let {
    reviewTitleValid, reviewDateValid, reviewValid, ratingValid
  } = helperMethods.getValidReview(
    reviewTitle, reviewDate, review, rating
  )
  const newReview = {
    movieId: movieId,
    userId: userId,
    reviewTitle: reviewTitleValid,
    reviewDate: reviewDateValid,
    review: reviewValid,
    rating: ratingValid
  }
  const insertInfo = await reviewsCollection.insertOne(newReview)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add review'
  }
  const newReviewId = insertInfo.insertedId.toString()
  const res = await getReviewById(newReviewId)
  return res
};

const getAllReviewsByMovieId = async (movieId) => {
  movieId = helperMethods.getValidId(movieId)
  const reviewList = await reviewsCollection.find({ movieId: movieId }).toArray()
  if (reviewList.length === 0) {
    throw ' movieId do not exists any reviews'
  }

  return reviewList
};

const getAllReviewsByUserId = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const reviewList = await reviewsCollection.find({ userId: userId }).toArray()
  if (reviewList.length === 0) {
    throw ' userId do not exists any reviews'
  }

  return reviewList
};

const deleteAllReviewsByUserId = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const deletionInfo = await reviewsCollection.deleteMany({ userId: userId })
  if (deletionInfo.deletedCount === 0) {
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