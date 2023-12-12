import { moviesData } from './data/index.js';
import { closeConnection } from './config/mongoConnection.js';
import fs from 'fs';

async function readJsonFile(file_path) {
  try {
    const data = await fs.promises.readFile(file_path, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return null;
  }
}

async function preloadData() {
  try {
    const jsonData = await readJsonFile("imdb.json");
    const transformedMoviesData = jsonData.map(movie => ({
      title: movie.Series_Title,
      plot: movie.Overview,
      studio: movie.studio,
      director: movie.Director,
      dateReleased: new Date(movie.Released_Date),
      duration: parseInt(movie.Runtime),
      overallRating: movie.IMDB_Rating,
      imageUrl: movie.Poster_Link
    }));

    for (const element of transformedMoviesData) {
      await moviesData.createMovie(element)
    }
    await closeConnection();
    process.exit();
  } catch (error) {
    console.log(`Got Error When Preloading Data: ${error.message}`);
  }
}

await preloadData();
