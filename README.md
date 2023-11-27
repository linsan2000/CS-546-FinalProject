# CS-546-FinalProject

Final Project for CS-546: Web Programming

## Group members:
* Wen Lin
* Jiexin Jin
* Qisheng Xia
* Hai Yuan
* Zhen Zhang


# Brief Description:
This project is a simplified movie database platform. Users can rate and post reviews for movies.

# Core Features:
## 1.Homepage:
Movie search: Users can search for movies using a search bar.
Movie recommendations: Recommending random movies to users.

## 2. Listing Page:
Search results: Displays the results of the user's search.
Brief movie information and rating: Shows a short introduction and rating for each movie listed.

## 3.Movie Details Page:
Informations: Provides more details about the movie.
Images: Images from the movie.
Rating and reviews: Movie's rating and reviews from users

## 4.Login Page:
Login by username and password.

## 5.Create Account Page:
Create account with username and password.

## 6.User Profile Page:
Display basic profile information.

## 7. Profile Update Page:
Modify user basic information.

## 8. Change Password Page:
Update account password by inputting old password.

## 9. User Rating List Page:
Users can view their own ratings history.

# Extra Features:
1. User can change the profile avatar on the profile update page
2. User can link the account to email
3. Including photos in reviews
4. Support following users feature



# Database Schema
## Movies Collection:
The Movie collection is a comprehensive repository of detailed movie information. Users can search for movies, explore in-depth details, peruse reviews, and contribute their own ratings.

{
  - **_id:** `"635506db850bafb5f76164fa"`
  - **Title:** `"Inception"`
  - **Plot:** `"A thief who enters the dreams of others to obtain secrets."`
  - **Genres:** `["Science Fiction", "Action"]`
  - **Rating:** `"PG-13"`
  - **Studio:** `"Warner Bros."`
  - **Director:** `"Christopher Nolan"`
  - **Cast:** `["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]`
  - **Date Released:** `"2010-07-16T09:00:00Z"`
  - **Duration:** `8880`
  - **Overall Rating:** `4.5`
  - **Image URL:** `["https://www.example-movie.jpg"]`
  - **Reviews:** `[]`
    
}






| Name           | Type     | Description                                             |
| -------------- | -------- | ------------------------------------------------------- |
| _id            | ObjectID | A unique identifier for the movie record                |
| title          | String   | It represents the name or title of the movie            |
| plot           | String   | A brief description or summary of the movie's storyline |
| genres         | Array    | An array containing the different categories or types that classify the movie |
| rating         | String   | Indicates the appropriate audience for the film         |
| studio         | String   | The production studio or company responsible for creating the movie |
| director       | String   | The person who directed the movie                        |
| cast           | Array    | Main actors who played significant roles in the movie    |
| dateReleased   | Date     | The date when the movie was officially released to the public |
| duration       | int      | The duration (seconds) of the movie                      |
| overallRating  | Double   | Provides an overall assessment of the movie's quality    |
| imageUrl       | String   | A URL pointing to an image or poster associated with the movie |
| reviews        | Array    | An array of users' reviews for the movie                 |




## Reviews subdocument:
Within the 'Movies' collection, the 'Reviews' subdocument contains users' thoughts and ratings, providing valuable review about each movie.

{
  - **Review ID:** `"63551d1cd63d907fe71b14bb"`
  - **Review Title:** `"Mind-Blowing!"`
  - **Review Date:** `"2023-01-15"`
  - **Reviewer Name:** `"MovieBuff123"`
  - **Review:** `"Inception is a masterpiece of a film that will leave you in awe."`
  - **Image URL:** `["https://www.example-movie.jpg"]`
  - **Rating:** `"5"`

}


| Name           | Type     | Description                               |
| -------------- | -------- | ----------------------------------------- |
| _id            | ObjectID | A unique identifier for the review        |
| reviewTitle    | String   | The title of the review                    |
| reviewDate     | Date     | Indicates the date when the review was created |
| reviewerName   | String   | The name of the user who wrote the review  |
| review         | String   | Content of the review                      |
| reviewImgUrl   | String   | The picture in the comment                 |
| rating         | Double   | User rating for this movie                 |






## Users Collection:   
The 'User' collection serves as a repository for all user information, enabling individuals to create accounts, personalize their profiles, and share their thoughts through reviews.

{
  - **ID:** `12761d1cd63d907fe71b14bb`
  - **Is Admin:** `true`
  - **Username:** `user123`
  - **Email:** `user123@example.com`
  - **First Name:** `John`
  - **Last Name:** `Doe`
  - **Birth Date:** `1990-05-15T09:00:00Z`
  - **Phone Number:** `555-555-5555`
  - **Avatar:** `["https://www.example-movie.jpg"]`
  - **ReviewHistory:** `[]`
  
}




| Name         | Type     | Description                                 |
| ------------ | -------- | ------------------------------------------- |
| _id          | ObjectID | A unique identifier for the user profile    |
| isAdmin      | boolean  | Whether the user has administrator rights   |
| username     | String   | The chosen identifier for the user           |
| email        | String   | User's email address                        |
| firstName    | String   | User's first name                           |
| lastName     | String   | User's last name                            |
| birthDate    | Date     | User's birthdate                            |
| phoneNumber  | String   | User's phone number                         |
| avatar       | String   | An image representing the user's profile    |
| reviewHistory| Array    | It contains the user's entire comment history |






## ReviewHistory subdocument:
Within the 'Users' collection, the 'ReviewHistory’ subdocument includes all the reviews previously shared by users.


{
   - **Review ID:** `63551d1cd63d907fe71b14bb`
   - **Review Title:** `Mind-Blowing!`
   - **Review Date:** `2023-01-15T09:00:00Z`
   - **Reviewer Name:** `MovieBuff123`
   - **Review:** `Inception is a masterpiece of a film that will leave you in awe.`
   - **Review Image:** `["https://www.example-movie.jpg"]`
   - **Rating:** `5`
     
}
  



| Name           | Type     | Description                               |
| -------------- | -------- | ----------------------------------------- |
| _id            | ObjectID | A unique identifier for the review        |
| reviewTitle    | String   | The title of the review                    |
| reviewDate     | Date     | Indicates the date when the review was created |
| reviewerName   | String   | The name of the user who wrote the review  |
| review         | String   | Content of the review                      |
| reviewImgUrl   | String   | The picture in the comment                 |
| rating         | Double   | User rating for this movie                 |


# APIs document
https://www.postman.com/cs-546-finalproject/workspace/apis