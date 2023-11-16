import { ObjectId } from 'mongodb'
const helperMethods = {
    getValidMovie(
        title,
        plot,
        MPA_FilmRatings,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        imageUrl
    ) {
        if (!this.isAllExist([
            title,
            plot,
            MPA_FilmRatings,
            studio,
            director,
            dateReleased,
            duration,
            overallRating,
            imageUrl])) {
            throw "not all fields are provided"
        }
        if (!this.isParamsStringAndNotJustEmptySpaces([
            title,
            plot,
            MPA_FilmRatings,
            studio,
            director,
            dateReleased,
            imageUrl
        ])) {
            throw "not string or empty strings"
        }
        title = title.trim()
        plot = plot.trim()
        MPA_FilmRatings = MPA_FilmRatings.trim()
        studio = studio.trim()
        director = director.trim()
        dateReleased = dateReleased.trim()
        imageUrl = imageUrl.trim()
        if (typeof duration !== 'number' || duration < 0) {
            throw "duration is not a valid number"
        }
        if (typeof overallRating !== 'number' || overallRating < 0) {
            throw "overallRating is not a valid number"
        }

        return {
            titleValid: title,
            plotValid: plot,
            MPA_FilmRatingsValid: MPA_FilmRatings,
            studioValid: studio,
            directorValid: director,
            dateReleasedValid: dateReleased,
            durationValid: duration,
            overallRatingValid: overallRating,
            imageUrlValid: imageUrl
        }
    },
    getValidReview(reviewTitle, reviewDate, review, rating) {
        if (!this.isAllExist([
            reviewTitle, reviewDate, review, rating])) {
            throw "not all fields are provided"
        }
        if (!this.isParamsStringAndNotJustEmptySpaces([
            reviewTitle, reviewDate, review
        ])) {
            throw "reviewTitle, reviewDate, review not strings or empty strings"
        }
        reviewTitle = reviewTitle.trim()
        reviewDate = reviewDate.trim()
        review = review.trim()
        if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            throw "rating is not a valid number"
        }
        return {
            reviewTitleValid: reviewTitle,
            reviewDateValid: reviewDate,
            reviewValid: review,
            ratingValid: rating
        }
    },
    getValidUser(username, password, email, isAdmin) {
        if (!this.isAllExist([
            username,
            password,
            email,
            isAdmin])) {
            throw "not all fields are provided"
        }
        if (!this.isValidUsername(username)) {
            throw "username is not valid"
        }
        if (!this.isValidPassword(password)) {
            throw "password is not valid"
        }
        if (!this.isValidEmailAddress(email)) {
            throw "email is not valid"
        }
        if (typeof isAdmin !== 'boolean') {
            throw "isAdmin is not a boolean"
        }
        username = username.trim()
        password = password.trim()
        email = email.trim()
        return {
            usernameValid: username,
            passwordValid: password,
            emailValid: email,
            isAdminValid: isAdmin
        }
    },
    isAllExist(args) {
        for (let arg of args) {
            if (arg == null || arg == undefined) {
                return false
            }
        }
        return true
    },
    isParamsStringAndNotJustEmptySpaces(params) {
        for (let param of params) {
            if (typeof param !== 'string' || param.trim().length === 0) {
                return false
            }
        }

        return true
    },
    isValidUsername(username) {
        var pattern = /^[a-zA-Z0-9_]+$/;

        return pattern.test(username);
    },
    isValidPassword(password) {
        var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%]{6,}$/;

        return pattern.test(password);
    },
    isValidEmailAddress(email) {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    },
    getValidId(id) {
        if (!id) {
            throw 'You must provide an id to update for'
        }
        if (typeof id !== 'string') {
            throw 'id must be a string'
        }
        if (id.trim().length === 0) {
            throw 'id cannot be an empty string or just spaces'
        }
        id = id.trim()
        if (!ObjectId.isValid(id)) {
            throw 'invalid object id'
        }

        return id
    }
}

const checkId = (id) => {
    if (!id) throw `Error: You must provide a id`;
    if (typeof id !== 'string') throw `Error:Id must be a string`;
    id = id.trim();
    if (id.length === 0)
        throw `Error: Id cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: Id invalid object ID`;
    return id;
}

export default helperMethods