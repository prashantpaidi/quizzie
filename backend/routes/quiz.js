const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const mongoose = require('mongoose');

const router = express.Router();
const { Quiz, UserResponse, Option, Question } = require('../models/quiz');

router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// add a new quiz
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, questions, quizType, timer, optionType, creatorId } =
      req.body;

    // Validate request parameters
    if (
      !title ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0 ||
      !quizType ||
      !timer ||
      !optionType ||
      !creatorId
    ) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Create an array to store the new questions
    const newQuestions = [];

    // Loop through each question in the request
    for (const { text, options, correctOptionId } of questions) {
      // Validate question data
      if (
        !text ||
        !options ||
        !Array.isArray(options) ||
        options.length === 0
      ) {
        return res.status(400).json({ error: 'Invalid question data' });
      }

      // Create an array to store the new options
      const newOptions = [];
      correctOptionObjectId = '';
      // Loop through each option in the question
      for (const [index, { text, image }] of options.entries()) {
        // Validate option data
        if (!text || (optionType === 'Text & Image URL' && !image)) {
          return res.status(400).json({ error: 'Invalid option data' });
        }

        // Create a new option
        const option = new Option({ text, image });

        // Save the new option to the database
        await option.save();

        // Add the new option's ID to the array
        newOptions.push(option._id);

        // Check if the index is equal to the correctOptionId
        if (index === correctOptionId) {
          // Perform additional logic here
          correctOptionObjectId = option._id;
        }
      }

      // Create a new question with the options array
      const question = new Question({
        text,
        options: newOptions,
        correctOptionId: correctOptionObjectId, // Convert to ObjectId
      });

      // Save the new question to the database
      await question.save();

      // Add the new question's ID to the array
      newQuestions.push(question._id);
    }

    // Create a new quiz with the questions array
    const quiz = new Quiz({
      title,
      questions: newQuestions,
      quizType,
      timer,
      optionType,
      creatorId,
    });

    // Save the new quiz to the database
    await quiz.save();

    res.json({ message: 'Quiz added successfully', quizId: quiz._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to retrieve all quizzes of a user
router.get('/user/:id', isLoggedIn, async (req, res) => {
  try {
    // Get the user ID from the logged-in user's session
    const userId = req.params.id;

    console.log('User ID:', userId);

    // Retrieve all quizzes for the user
    const userQuizzes = await Quiz.find({ creatorId: userId })
      .populate({
        path: 'questions',
        model: 'Question',
        populate: {
          path: 'options',
          model: 'Option',
        },
      })
      .exec();

    console.log('User Quizzes:', userQuizzes);

    res.json({ quizzes: userQuizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
