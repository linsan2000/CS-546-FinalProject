import { MongoClient } from 'mongodb'
import { mongoConfig } from './settings.js'

let _connection = undefined
let _db = undefined

export const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl)
    _db = _connection.db(mongoConfig.database)
  }

  return _db
};

export const closeConnection = async () => {
  try {
    if (_connection) {
      await _connection.close();
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};
