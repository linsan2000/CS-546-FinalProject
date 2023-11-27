import { registerUser, getAllUsers, getUserById, removeUserById, updateUserById, login } from '../data/users.js'
import express from 'express';
const router = express.Router();
import helpers from '../helpers.js'

router
  .route('/')
  .get(async (req, res) => {  // getAllUsers
    try {
      const event = await getAllUsers()
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  });



router
  .route('/register')
  .post(async (req, res) => {   // registerUser
  try {
    let { username, password, email, confirmPassword, isAdmin } = req.body;
    let { usernameValid, emailValid, isAdminValid, passwordValid,
    } = helpers.getValidUser(
      username,
      password,
      email,
      isAdmin
    )
    if (confirmPassword !== password) throw 'It should be the same value as passwordInput'
    const event = await registerUser(usernameValid, emailValid, passwordValid, isAdminValid)
    return res.status(200).json(event);
  } catch (e) {
    if (e.name === '404') {
      res.status(404).json({ error: e.message });
    } else if (e.message) {
      res.status(400).json({ error: e.message });
    } else res.status(400).json({ error: e });
  }
});

router
  .route('/:userId')
  .get(async (req, res) => {    // getUserById
    try {
      const event = await getUserById(helpers.getValidId(req.params.userId))
      return res.status(200).json(event);

    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {   // removeUserById
    try {
      const event = await removeUserById(helpers.getValidId(req.params.userId))
      return res.status(200).json(event);

    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })
  .put(async (req, res) => {  // updateUserById
    try {
      let { username, password, email, isAdmin } = req.body
      let { usernameValid, emailValid, isAdminValid, passwordValid,
      } = helpers.getValidUser(
        username,
        password,
        email,
        isAdmin
      )
      const event = await updateUserById(helpers.getValidId(req.params.userId), usernameValid, passwordValid, emailValid, isAdminValid)
      return res.status(200).json(event);
    } catch (e) {
      if (e.name === '404') {
        res.status(404).json({ error: e.message });
      } else if (e.message) {
        res.status(400).json({ error: e.message });
      } else res.status(400).json({ error: e });
    }
  })

router
  .route('/login')
  .post(async (req, res) => {  // login
    try {
      let { emailAddress, password } = req.body
      let {
        emailAddressValid, passwordValid,
      } = helpers.getValidLogin(
        emailAddress,
        password,
      )
      const event = await login(emailAddressValid, passwordValid)
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