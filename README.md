# Secure Notes API (Lab 14.2 - Secure Record Storage)

**Lab 2 - Secure Record Storage**

## Author
Dewan Mahmud (Rocky)
Per Scholas - Software Engineering

## Overview

This project is a secure Notes API built with **Node.js, Express, MongoDB (Mongoose), and JWT**.

The goal of this lab is to fix a security flaw where any authenticated user could access any note.  
This API now enforces **ownership-based authorization**, ensuring users can only view, update, or delete **their own notes**.


## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- bcrypt
- jsonwebtoken
- dotenv

## Setup Instructions & Initialize Project
npm init -y

## Install Dependencies
npm install express mongoose bcrypt jsonwebtoken dotenv

## Install Dev Dependencies
npm install -D nodemon

## Generate JWT Secret
Run this command once to generate a secure JWT secret:

- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

1) Create .env File
Create a .env file in the root directory:

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/notesdb
JWT_SECRET=long_random_secret

2. Start Development Server
   npm run dev

Server will run at:

http://localhost:3000

## API Routes User Authentication

- POST /api/users/register
- POST /api/users/login

## Notes (Protected Routes)
All note routes require a valid JWT token:

- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id

## How to Test Using Postman 

### Step 1 - Register a User
POST

http://localhost:3000/api/users/register
Body → raw → JSON

{
"username": "user1",
"email": "user1@test.com",
"password": "password123"
}
- The response will include a token.
- Copy the token - it is required for all note requests.

### Step 2 - Add Bearer Token in Postman
For every request to /api/notes:

Open the request in Postman

Click the Authorization tab

Set Type to Bearer Token

Paste the token into the Token field

Send the request

Postman will automatically create this header:

Authorization: Bearer YOUR_TOKEN_HERE

### Step 3 - Create a Note
POST

http://localhost:3000/api/notes

Authorization:

Type: Bearer Token

Token: (paste token)

Body => raw => JSON

{
"title": "My First Note",
"content": "This note belongs only to me."
}
 - Status: 201 Created

### Step 4 - Get Your Notes
GET

http://localhost:3000/api/notes
Authorization:

Bearer Token required

- Returns only notes owned by the logged-in user.

### Step 5 - Update a Note (Owner Only)
PUT

http://localhost:3000/api/notes/NOTE_ID_HERE
Authorization:

Bearer Token required

Body => raw => JSON

{
"title": "Updated Title",
"content": "Updated content"
}
Owner => Note updates successfully
Non-owner => 403 Forbidden

6. Step 6 - Delete a Note (Owner Only)
DELETE

http://localhost:3000/api/notes/NOTE_ID_HERE

Authorization:
Bearer Token required
Owner => Note deleted
Non-owner => 403 Forbidden

## Authorization Rules (Lab Requirements)
- Each note stores the creator’s user ID
- Users can only access notes they created
- Unauthorized update/delete attempts return 403 Forbidden

## Common Errors
1. "You must be logged in to do that."
- Missing Bearer token in Postman

2. "Invalid token."
- Token expired or copied incorrectly
- Log in again to generate a new token

3. MongoDB Connection Error
- Ensure MongoDB is running
- Verify MONGO_URI in .env

## Special Thanks
Special thanks to Per Scholas instructors and mentors for their guidance on authentication, authorization, and secure API design.
This lab provided valuable hands-on experience with real-world backend security concepts.

## Reflection (Challenges & Lessons Learned)
- The main challenge I faced in this lab was implementing ownership-based authorization correctly. At first, all authenticated users could access any note, which helped me clearly understand the difference between authentication (verifying who the user is) and authorization (controlling what the user can do).

- I also struggled initially with passing JWT tokens correctly in Postman. Learning how to use the Authorization → Bearer Token option helped me understand how middleware extracts and validates tokens for protected routes.

- Overall, this lab strengthened my understanding of secure API development, user-specific data protection, and the importance of authorization checks in backend applications.