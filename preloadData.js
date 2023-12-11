import { movies } from './config/mongoCollections.js'
import { dbConnection, closeConnection } from './config/mongoConnection.js';
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
  const collection = await movies()
  try {
    // const db = await dbConnection();
    // await db.dropDatabase();
    const jsonData = await readJsonFile("imdb.json");
    const transformedMoviesData = jsonData.map(movie => ({
      title: movie.Series_Title,
      plot: movie.Overview,
      studio: movie.studio, 
      director: movie.Director,
      // dateReleased: movie.Released_Year.toString(), 
      // dateReleased: movie.Released_Year, 
      dateReleased: dateReleased.toISOString(),
      duration: parseInt(movie.Runtime), 
      overallRating: movie.IMDB_Rating,
      imageUrl: movie.Poster_Link
    }));

    for (const element of transformedMoviesData) {
      const existingDocument = await collection.findOne({ title: element.title });
      if (!existingDocument) {
        await collection.insertOne(element);
        console.log(`${element.title} inserted`);
      } else {
        console.log('Document with the same name already exists. Skipped insertion.');
      }
    }

    await closeConnection();
    console.log('Done!');
  } catch (error) {
    console.log(`Got Error When Preloading Data: ${error.message}`);
  } 
}


preloadData();
