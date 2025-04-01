# FinacPlusAuth User Registration System - Full Stack

This README provides a step-by-step guide to set up and running the FinacPlusAuth User Registration System Full-Stack project locally.

## Table of Contents
- Prerequisites
- Getting Started
  - Clone the Repository
  - Backend Setup
  - Frontend Setup
  - Running the Application
- Enjoy Your Local Setup

## Prerequisites
Make sure you have the following installed on your machine:

- Node.js
- Git
- MongoDB (Ensure it's running locally)

## Getting Started
Follow these steps to set up the project locally.

### 1. Clone the Repository
First, open VS Code terminal and clone the repository to your local machine:

```sh
git clone https://github.com/AnuLikhithaImmadisetty/FinacPlus-FullStack.git
```

Navigate into the project directory:

```sh
cd FinacPlus-FullStack
```

### 2. Backend Setup
Next, set up the backend:

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install project dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file inside the `backend` directory with the following content:
   ```sh
   PORT = 5000
   DB_URI = mongodb://localhost:27017/FinacPlus
   LOCAL_URI = http://localhost:5173
   ```
4. Start the server:
   ```sh
   node server.js
   ```
   If everything is set up correctly, you should see the following message in the terminal:
   ```
   Server is working on PORT: 5000
   2024-08-10T17:13:12.307Z
   Database connected with localhost
   ```

### 3. Frontend Setup
Now, set up the frontend:

1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install project dependencies:
   ```sh
   npm install
   ```
3. Open the `App.jsx` file inside the `src` folder and set the base URL as follows:
   ```js
   export const baseurl = "http://127.0.0.1:5000/api/v1/user";
   ```

### 4. Running the Application
To run the application, execute the following command in the frontend directory:

```sh
npm run dev
```

Now, open your browser and navigate to:

```
http://localhost:5173
```

Your project should now be running locally!

## Enjoy Your Local Setup
You're all set! Enjoy working on your project locally. If you encounter any issues, feel free to reach out for help.

