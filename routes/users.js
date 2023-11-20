import { userData } from '../data/users.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route('/attendee/:attendeeId')
  .get(async (req, res) => {
    //code here for GET
  })
  .delete(async (req, res) => {
    //code here for DELETE
  });