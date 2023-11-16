import helperMethods from "../helpers.js"
import { users } from '../config/mongoCollections.js'
import { reviewsData } from "./index.js"
import { ObjectId } from 'mongodb'

const usersCollection = await users()

const createUser = async (
  username,
  password,
  email,
  isAdmin
) => {
  let {
    usernameValid, emailValid, isAdminValid, passwordValid,
  } = helperMethods.getValidUser(
    username,
    password,
    email,
    isAdmin
  )
  const newUser = {
    username: usernameValid,
    password: passwordValid,
    email: emailValid,
    isAdmin: isAdminValid,
  }
  if (!usersCollection) {
    throw 'usersCollection can not be created'
  }
  const insertInfo = await usersCollection.insertOne(newUser)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user'
  }

  const newId = insertInfo.insertedId.toString()
  const user = await getUserById(newId)
  return user
}

const getAllUsers = async () => {
  let userList = await usersCollection.find({}).toArray()

  if (!userList) {
    throw 'Could not get all users'
  }

  return userList
}

const getUserById = async (userId) => {
  userId = helperMethods.getValidId(userId)
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  if (user === null) {
    throw 'No user with that userId'
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
    throw 'No user with that userId'
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
  let res = await usersCollection.updateOne({ _id: new ObjectId(userId) }, {
    $set: updateUser
  })

  return await usersCollection.findOne({ _id: new ObjectId(userId) })
}

export { createUser, getAllUsers, getUserById, removeUserById, updateUserById }
