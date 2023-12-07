import helperMethods from "../helpers.js"
import { users } from '../config/mongoCollections.js'
import { reviewsData } from "./index.js"
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt';

const saltRounds = 0;
const usersCollection = await users()

const registerUser = async (
  username,
  emailAddress,
  password,
  role
) => {
  let {
    usernameValid, emailAddressValid, passwordValid, roleValid,
  } = helperMethods.getValidUser(
    username,
    emailAddress,
    password,
    role
  )
  const newUser = {
    username: usernameValid,
    emailAddress: emailAddressValid,
    password: passwordValid,
    role: roleValid,
  }
  if (!usersCollection) {
    throw 'usersCollection can not be created'
  }
  let user = await usersCollection.findOne({ emailAddress: newUser.email })
  if (user) {
    throw 'emailAddress already existed'
  }
  const hash = await bcrypt.hash(newUser.password, saltRounds);
  newUser.password = hash;
  const insertInfo = await usersCollection.insertOne(newUser)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user'
  }

  return { insertedUser: true }
}

const getAllUsers = async () => {
  let userList = await usersCollection.find({}, { projection: { _id: 1, username: 1, email: 1, isAdmin: 1 } }).toArray()

  if (!userList) {
    throw 'Could not get all users'
  }

  return userList
}

const getUserById = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { _id: 1, username: 1, email: 1, isAdmin: 1 } })
  if (user === null) {
    throw Object.assign(new Error('No user with that userId'), { name: '404' });
  }
  user._id = user._id.toString()
  return user
}

const removeUserById = async (userId) => {
  userId = helperMethods.getValidId(userId)
  let deletionInfo = await usersCollection.findOneAndDelete({
    _id: new ObjectId(userId)
  })

  if (!deletionInfo) {
    throw `Could not delete user with userId of ${userId}`
  }
  reviewsData.deleteAllReviewsByUserId(userId)

  return {
    title: deletionInfo.title,
    deleted: Boolean(true)
  }
}

const updateUserById = async (
  userId,
  username,
  password,
  email,
  isAdmin
) => {
  userId = helperMethods.getValidId(userId)
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  if (user === null) {
    throw Object.assign(new Error('No user with that userId'), { name: '404' });
  }
  let {
    usernameValid, emailValid, isAdminValid, passwordValid,
  } = helperMethods.getValidUser(
    username,
    password,
    email,
    isAdmin
  )
  const updateUser = {
    username: usernameValid,
    password: passwordValid,
    email: emailValid,
    isAdmin: isAdminValid,
  }
  const hash = await bcrypt.hash(updateUser.password, saltRounds);
  updateUser.password = hash;
  let res = await usersCollection.updateOne({ _id: new ObjectId(userId) }, {
    $set: updateUser
  })

  return await usersCollection.findOne({ _id: new ObjectId(userId) })
}

const loginUser = async (emailAddress, password) => {
  let {
    emailAddressValid, passwordValid,
  } = helperMethods.getValidLogin(
    emailAddress,
    password,
  )
  const user = await usersCollection.findOne({ emailAddress: emailAddressValid })
  if (!user) {
    throw 'Either the email address or password is invalid'
  }
  const match = await bcrypt.compare(passwordValid, user.password);
  if (!match) {
    throw 'Either the email address or password is invalid'
  }

  return {
    username: user.username,
    emailAddress: user.emailAddress,
    role: user.role
  }
}

export { registerUser, getAllUsers, getUserById, removeUserById, updateUserById, loginUser }
