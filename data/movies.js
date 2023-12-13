import helperMethods, { formatDate } from "../helpers.js"
import { movies } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'

const moviesCollection = await movies()

const createMovie = async (movieInfo) => {
  let { title, director, studio, dateReleased, duration, plot, imageUrl } = movieInfo;
  let {
    titleValid, plotValid, studioValid, directorValid, dateReleasedValid, durationValid, imageUrlValid
  } = helperMethods.getValidMovie(
    title,
    plot,
    studio,
    director,
    dateReleased,
    duration,
    0,
    0,
    imageUrl
  )
  const newMovie = {
    title: titleValid,
    plot: plotValid,
    studio: studioValid,
    director: directorValid,
    dateReleased: dateReleasedValid,
    duration: durationValid,
    overallRating: 0,
    numberOfRatings: 0,
    imageUrl: imageUrlValid
  }
  if (!moviesCollection) {
    throw 'moviesCollection can not be created'
  }
  const insertInfo = await moviesCollection.insertOne(newMovie)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add movie'
  }

  return { success: true }
}
export function getDurationStr(duration) {
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
const getMoviePageList = async ({ page, limit, q = '' }) => {
  let reg = new RegExp(".*" + q + ".*$", "i")
  let movieList = await moviesCollection.find({
    $or: [
      {
        title: {
          $regex: reg,
        }
      },
      {
        director: {
          $regex: reg,
        }
      },
      {
        studio: {
          $regex: reg,
        }
      }
      ,
      {
        plot: {
          $regex: reg,
        }
      }
    ]
  }).sort({
    dateReleased: 1
  });
  let total = await movieList.count()
  let data = await movieList.skip((page - 1) * limit).limit(limit).toArray()
  return {
    data: data.map(m => ({
      ...m,
      _id: m._id.toString(),
      duration: getDurationStr(m.duration),
      dateReleased: formatDate(m.dateReleased, 'dd/MM/yyyy'),
    })),
    curr: page,
    limit: limit,
    total: total
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
    plot: m.plot,
    overallRating: m.overallRating
  }))
}

const getMovieById = async (movieId) => {
  let movieIdValid = helperMethods.getValidId(movieId)
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
  studio,
  director,
  dateReleased,
  duration,
  overallRating,
  numberOfRatings,
  imageUrl
) => {
  movieId = helperMethods.getValidId(movieId)
  const movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) })
  if (movie === null) {
    throw Object.assign(new Error('No movie with that movieId'), { name: '404' });
  }
  let {
    titleValid, plotValid, studioValid, directorValid, dateReleasedValid, durationValid, overallRatingValid, numberOfRatingsValid, imageUrlValid
  } = helperMethods.getValidMovie(
    title,
    plot,
    studio,
    director,
    dateReleased,
    duration,
    overallRating,
    numberOfRatings,
    imageUrl
  )
  const updatemovie = {
    title: titleValid,
    plot: plotValid,
    studio: studioValid,
    director: directorValid,
    dateReleased: dateReleasedValid,
    duration: durationValid,
    overallRating: overallRatingValid,
    numberOfRatings: numberOfRatingsValid,
    imageUrl: imageUrlValid,
  }
  let res = await moviesCollection.updateOne({ _id: new ObjectId(movieId) }, {
    $set: updatemovie
  })

  return await moviesCollection.findOne({ _id: new ObjectId(movieId) })
}

export { createMovie, getAllMovies, getMovieById, removeMovieById, updateMovieById, getMoviePageList }
