import { ObjectId } from 'mongodb'
const helperMethods = {
    getValidMovie(
        title,
        plot,
        studio,
        director,
        dateReleased,
        duration,
        overallRating,
        numberOfRatings,
        imageUrl
    ) {
        if (!this.isAllExist([
            title,
            plot,
            studio,
            director,
            dateReleased,
            duration,
            overallRating,
            numberOfRatings,
            imageUrl])) {
            throw "not all fields are provided"
        }
        if (!this.isParamsStringAndNotJustEmptySpaces([
            title,
            plot,
            studio,
            director,
            imageUrl
        ])) {
            throw "not string or empty strings"
        }
        title = title.trim()
        plot = plot.trim()
        studio = studio.trim()
        director = director.trim()
        imageUrl = imageUrl.trim()
        duration = Number(duration)
        dateReleased = new Date(dateReleased)
        overallRating = Number(overallRating)
        numberOfRatings = Number(numberOfRatings)

        if (typeof duration !== 'number' || duration < 0) {
            throw "duration is not a valid number"
        }
        if (!(dateReleased instanceof Date)) {
            throw "dateReleased is not a date";
        }

        return {
            titleValid: title,
            plotValid: plot,
            studioValid: studio,
            directorValid: director,
            dateReleasedValid: dateReleased,
            durationValid: duration,
            overallRatingValid: overallRating,
            numberOfRatingsValid: numberOfRatings,
            imageUrlValid: imageUrl
        }
    },
    getValidReview(review, rating) {
        if (!this.isAllExist([
            review, rating])) {
            throw "not all fields are provided"
        }
        if (!this.isParamsStringAndNotJustEmptySpaces([
            review
        ])) {
            throw "review not strings or empty strings"
        }
        review = review.trim()
        rating = Number(rating)
        if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            throw "rating is not a valid number"
        }
        return {
            reviewValid: review,
            ratingValid: rating
        }
    },
    getValidUser(username, emailAddress, password, role) {
        if (!this.isAllExist([
            username,
            emailAddress,
            password,
            role])) {
            throw "not all fields are provided"
        }
        if (!this.isValidUsername(username)) {
            throw "username is not valid"
        }
        if (!this.isValidEmailAddress(emailAddress)) {
            throw "emailAddress is not valid"
        }
        if (!this.isValidPassword(password)) {
            throw "password is not valid"
        }
        if (!this.isValidRole(role)) {
            throw "role is not valid"
        }
        username = username.trim()
        emailAddress = emailAddress.trim()
        password = password.trim()
        role = role.toLowerCase().trim()
        return {
            usernameValid: username,
            emailAddressValid: emailAddress,
            passwordValid: password,
            roleValid: role
        }
    },
    getValidLogin(emailAddress, password) {
        if (!this.isAllExist([emailAddress, password])) {
            throw 'emailAddress and password are required'
        }
        if (!this.isParamsStringAndNotJustEmptySpaces([emailAddress, password])) {
            throw 'emailAddress and password must be strings'
        }
        if (!this.isValidEmailAddress(emailAddress)) {
            throw "email is not valid"
        }
        if (!this.isValidPassword(password)) {
            throw "password is not valid"
        }
        emailAddress = emailAddress.toLowerCase().trim()
        password = password.trim()
        return {
            emailAddressValid: emailAddress,
            passwordValid: password
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
        if (typeof username !== 'string' || username.trim() === '' || /\d/.test(username) || username.length < 2 || username.length > 25) {
            return false
        }

        return true
    },
    isValidPassword(password) {
        if (typeof password !== 'string' || password.trim() === '' || /\s/.test(password)) {
            return false
        }
        var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[0-9a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

        return pattern.test(password)
    },
    isValidEmailAddress(emailAddress) {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(emailAddress)
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
    },
    isValidRole(role) {
        role = role.toLowerCase()
        if (role !== 'admin' && role !== 'user') {
            return false
        }

        return true
    },
}
export function formatDate(dateTime, format = 'yyyy-MM-dd hh:mm:ss') {
    const date = typeof dateTime === 'string' ? getDateFromStr(dateTime) : dateTime;
    try {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const milSecond = date.getMilliseconds();
        format = format.replace('yyyy', date.getFullYear().toString());
        format = format.replace('yy', date.getFullYear().toString().substring(2, 4));
        format = format.replace('MM', month < 10 ? '0' + month : month.toString());
        format = format.replace('dd', day < 10 ? '0' + day : day.toString());
        format = format.replace('hh', hour < 10 ? '0' + hour : hour.toString());
        format = format.replace('mm', minute < 10 ? '0' + minute : minute.toString());
        format = format.replace('ss', second < 10 ? '0' + second : second.toString());
        format = format.replace('ms', milSecond < 10 ? '0' + milSecond : milSecond.toString());
    } catch { }
    return format;
}

export default helperMethods