import helperMethods from "../helpers.js"
import { movies } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'

const moviesCollection = await movies()

const createMovie = async (
  title,
  plot,
  MPA_FilmRatings,
  studio,
  director,
  dateReleased,
  duration,
  overallRating,
  imageUrl
) => {
  let {
    titleValid, plotValid, MPA_FilmRatingsValid, studioValid, directorValid, dateReleasedValid, durationValid, overallRatingValid, imageUrlValid
  } = helperMethods.getValidmovie(
    title,
    plot,
    MPA_FilmRatings,
    studio,
    director,
    dateReleased,
    duration,
    overallRating,
    imageUrl
  )
  const newMovie = {
    title: titleValid,
    plot: plotValid,
    MPA_FilmRatings: MPA_FilmRatingsValid,
    studio: studioValid,
    director: directorValid,
    dateReleased: dateReleasedValid,
    duration: durationValid,
    overallRating: overallRatingValid,
    imageUrl: imageUrlValid,
  }
  if (!moviesCollection) {
    throw 'moviesCollection can not be created'
  }
  const insertInfo = await moviesCollection.insertOne(newMovie)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add movie'
  }

  const newId = insertInfo.insertedId.toString()
  const movie = await getMovieById(newId)
  return movie
}

const getAllMovies = async () => {
  let movieList = await moviesCollection.find({}).project({ _id: 1, title: 1, overallRating: 1, imageUrl: 1 }).toArray()

  if (!movieList) {
    throw 'Could not get all movies'
  }

  return movieList
}

const getMovieById = async (movieId) => {
  movieId = helperMethods.getValidId(movieId)
  const movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) })
  if (movie === null) {
    throw 'No movie with that movieId'
  }
  movie._id = movie._id.toString()
  return movie
}

const removeMovieById = async (movieId) => {
  movieId = helperMethods.getValidId(movieId)
  let deletionInfo = await moviesCollection.findOneAndDelete({
    _id: new ObjectId(movieId)
  })

  if (!deletionInfo) {
    throw `Could not delete movie with movieId of ${movieId}`
  }

  return {
    title: deletionInfo.title,
    deleted: Boolean(true)
  }
}

const updateMovieById = async (
  movieId,
  title,
  plot,
  MPA_FilmRatings,
  studio,
  director,
  dateReleased,
  duration,
  overallRating,
  imageUrl
) => {
  movieId = helperMethods.getValidId(movieId)
  const movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) })
  if (movie === null) {
    throw 'No movie with that movieId'
  }
  let {
    titleValid, plotValid, MPA_FilmRatingsValid, studioValid, directorValid, dateReleasedValid, durationValid, overallRatingValid, imageUrlValid
  } = helperMethods.getValidmovie(
    title,
    plot,
    MPA_FilmRatings,
    studio,
    director,
    dateReleased,
    duration,
    overallRating,
    imageUrl
  )
  const updatemovie = {
    title: titleValid,
    plot: plotValid,
    MPA_FilmRatings: MPA_FilmRatingsValid,
    studio: studioValid,
    director: directorValid,
    dateReleased: dateReleasedValid,
    duration: durationValid,
    overallRating: overallRatingValid,
    imageUrl: imageUrlValid,
  }
  let res = await moviesCollection.updateOne({ _id: new ObjectId(movieId) }, {
    $set: updatemovie
  })

  return await moviesCollection.findOne({ _id: new ObjectId(movieId) })
}

export { createMovie, getAllMovies, getMovieById, removeMovieById, updateMovieById }
