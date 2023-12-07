import helperMethods from "../helpers.js"
import { movies } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'

const moviesCollection = await movies()

const createMovie = async (movieInfo) => {
  const insertInfo = await moviesCollection.insertOne(movieInfo)
  if (!insertInfo.insertedId) {
    throw 'Server error, please try agian.'
  }
  return { success: true }
}
// const createMovie = async (
//   title,
//   plot,
//   MPA_FilmRatings,
//   studio,
//   director,
//   dateReleased,
//   duration,
//   imageUrl
// ) => {
//   let {
//     titleValid, plotValid, MPA_FilmRatingsValid, studioValid, directorValid, dateReleasedValid, durationValid, imageUrlValid
//   } = helperMethods.getValidMovie(
//     title,
//     plot,
//     MPA_FilmRatings,
//     studio,
//     director,
//     dateReleased,
//     duration,
//     imageUrl
//   )
//   const newMovie = {
//     title: titleValid,
//     plot: plotValid,
//     MPA_FilmRatings: MPA_FilmRatingsValid,
//     studio: studioValid,
//     director: directorValid,
//     dateReleased: dateReleasedValid,
//     duration: durationValid,
//     overallRating: 0,
//     imageUrl: imageUrlValid
//   }
//   if (!moviesCollection) {
//     throw 'moviesCollection can not be created'
//   }
//   const insertInfo = await moviesCollection.insertOne(newMovie)
//   if (!insertInfo.acknowledged || !insertInfo.insertedId) {
//     throw 'Could not add movie'
//   }

//   return { insertedMovie: true }
// }
function getDurationStr(duration) {
  if (duration < 60) {
    return duration.toFixed(0) + ' Seconds'
  }
  else if (duration < 60 * 60) {
    let mins = duration / 60
    return mins.toFixed(2) + ' Minitues'
  }
  else if (duration < 60 * 60 * 24) {
    let hours = duration / (60 * 60)
    return hours.toFixed(2) + ' Hours'
  }
  else {
    let hours = duration / (60 * 60 * 24)
    return hours.toFixed(2) + ' Days'
  }
}
/**
 * get movie list by page
 * @param {*} param0 
 * @returns 
 */
const getMoviePageList = async ({ page, limit, queryStr }) => {
  let movieList = await moviesCollection.find({}).sort({
    dateReleased: 1
  }).skip((page - 1) * limit).limit(limit);
  return {
    data: await movieList.toArray(),
    curr: page,
    limit: limit,
    total: await movieList.count()
  }
}
const getAllMovies = async () => {
  // let movieList = await moviesCollection.find({}).project({ _id: 1, title: 1, overallRating: 1, imageUrl: 1 }).toArray()
  let movieList = await moviesCollection.find({}).toArray()
  return movieList.map(m => ({
    title: m.title,
    id: m._id.toString(),
    director: m.director,
    studio: m.studio,
    duration: getDurationStr(m.duration),
    imageUrl: m.imageUrl,
    dateReleased: m.dateReleased.toString(),
    plot: m.plot
  }))
}

const getMovieById = async (movieId) => {
  movieIdValid = helperMethods.getValidId(movieId)
  const movie = await moviesCollection.findOne({ _id: new ObjectId(movieIdValid) })
  if (movie === null) {
    throw Object.assign(new Error('No movie with that movieId'), { name: '404' });
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
    throw Object.assign(new Error('No movie with that movieId'), { name: '404' });
  }
  let {
    titleValid, plotValid, MPA_FilmRatingsValid, studioValid, directorValid, dateReleasedValid, durationValid, overallRatingValid, imageUrlValid
  } = helperMethods.getValidMovie(
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

export { createMovie, getAllMovies, getMovieById, removeMovieById, updateMovieById, getMoviePageList }
