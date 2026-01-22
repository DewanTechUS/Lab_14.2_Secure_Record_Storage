# Project Setup & JWT Secret Generation

## Initialize Project
git init
npm init -y

## Install Dependencies
npm install express mongoose bcrypt jsonwebtoken dotenv

## Install Dev Dependencies
npm install -D nodemon

## Generate JWT Secret
Run this command once to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## Create .env File
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/notes_db
JWT_SECRET=generated_secret_here

## Start Development Server
npm run dev

## Notes
- Generate JWT_SECRET only once
- Do not commit .env
- Restart server after editing .env
