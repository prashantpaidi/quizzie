# Quizzie - A Quiz Builder Application

Quizzie is a web application that allows users to create and share quizzes with ease.  Users can create various types of quizzes, including multiple-choice questions, and then share them with friends.  Friends can then take these quizzes without needing to log in.

## Key Features

*   **Quiz Creation:**
    *   Create quizzes with multiple-choice questions.
    *   Choose between "Q & A" (standard quiz) and "Poll Type" (open-ended).
    *   Set timers for quizzes (OFF, 5 Sec, 10 Sec).
    *   Choose between Text, Image URL, or Text & Image URL for options.
*   **Quiz Sharing:**
    *   Easily share quiz links with friends.
    *   Share links are copied to the clipboard with a single click.
*   **Quiz Taking:**
    *   Friends can take quizzes without having to log in.
    *   Real-time timer for quizzes if enabled by the creator.
    *   Immediate feedback on score (for "Q & A" type quizzes)
*   **User Authentication**
     * User can create an account and login to create a quiz
     *  User will be redirected to login page if not authenticated
*   **Quiz Analytics:**
    *  View analytics for your created quizzes.
    *  Track quiz impressions and participation.
    *  Question-wise analysis to see how well each question performed
* **Responsive Design:**
     *  App is responsive and works fine on all device

## Getting Started

Follow these steps to set up and run Quizzie locally:

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd quizzie
    ```

2.  **Navigate to the backend folder:**

    ```bash
    cd backend
    ```

3.  **Install backend dependencies:**

    ```bash
    npm install
    ```
4. **Create a `.env` file:**
    *  Create a `.env` file inside the `backend` directory
    *  Add the following
         ```
           MONGODB_URL = <YOUR MONGODB URL>
           JWT_SECRET = <YOUR JWT SECRET>
           PORT = <PORT>
         ```
       *   Replace `<YOUR MONGODB URL>`, `<YOUR JWT SECRET>` and `<PORT>` with your actual values.
5. **Run the backend**
     ```bash
        node index.js
     ```
     The server will run on `http://localhost:<PORT>`

6.  **Navigate to the frontend folder:**

    ```bash
    cd ../frontend
    ```

7.  **Install frontend dependencies:**

    ```bash
    npm install
    ```
8. **Create `.env` file**
   * Create a `.env` file in the `frontend` directory
   * Add the following
    ```
    VITE_APP_API_URL = http://localhost:<PORT>
    VITE_APP_WEB_URL = http://localhost:5173
    ```
     *   Replace `<PORT>` with your backend port
    *  `VITE_APP_WEB_URL` is the url for the frontend you want to access the application

9.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The app will be accessible at `http://localhost:5173/` or the URL you have setup in `VITE_APP_WEB_URL` .

## Project Structure

The project is structured into two main parts:

### `backend/`

*   **`index.js`:** Main entry point for the Node.js server.
*   **`package.json`:** Contains dependencies and scripts for backend.
*   **`middlewares/`:** Contains custom middlewares like `isLoggedIn.js` for user authentication.
*   **`models/`:** Contains Mongoose schemas for `quiz.js` and `user.js`.
*   **`routes/`:** Contains API routes:
    *   `auth.js`: Routes for user registration and login.
    *   `quiz.js`: Routes for quiz creation, fetching, and deletion.

### `frontend/`

*   **`index.html`:** Main HTML file.
*   **`package.json`:** Contains dependencies and scripts for frontend.
*   **`src/`:** Contains:
    *   **`main.jsx`:** Entry point for React application.
    *   **`App.jsx`:** Root component for routing.
    *   **`index.css`:** Global CSS styles.
    *   **`App.css`:** CSS styles for the App component.
    *   **`assets/`:** Contains images and svg icons.
    *   **`component/`:** Reusable React components like:
        *   `auth`: Components for login and registration.
        *   `Quiz`: Components for building and rendering quizzes, delete modal
    *   **`pages/`:**
        *   `Analytics`: Contains components to display quiz analytics and question-wise analysis
        *   `Auth`: Authentication related pages for login and register.
        *    `Dashboard`: Dashboard screen and trending quizzes.
        *   `Home`: Layout and not found components.
        *   `Quiz`: Components to add quiz and display link, handle quiz response and display result.

## Technologies Used

### Frontend

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Build tool for React applications.
*   **React Router DOM:** Library for routing in React applications.
*   **React Hot Toast:** Library for displaying notifications.

### Backend

*   **Node.js:** JavaScript runtime environment.
*   **Express:** Web framework for Node.js.
*   **MongoDB:** Database for storing data.
*   **Mongoose:** MongoDB object modeling tool.
*   **JSON Web Tokens (JWT):** Used for authentication.
*   **Bcrypt:** For hashing passwords.
*   **CORS:** For cross-origin resource sharing.

  
## Contributing

Contributions are always welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add your feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Create a new Pull Request.
