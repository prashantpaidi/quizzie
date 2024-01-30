const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const mongoose = require('mongoose');

const router = express.Router();
const { Quiz, UserResponse, Option, Question } = require('../models/quiz');

router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate({
        path: 'questions',
        model: 'Question',
        populate: {
          path: 'options',
          model: 'Option',
        },
      })
      .exec();

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Increase the impression count
    quiz.impressionCount += 1;
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  add a new quiz
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
      !optionType ||
      !creatorId
    ) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    if (quizType === 'Q & A' && !timer) {
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
        if (
          (optionType === 'Text' && !text) ||
          ((optionType === 'Text & Image URL' || optionType === 'Image URL') &&
            !image)
        ) {
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

      if (quizType === 'Poll Type') {
        correctOptionObjectId = null;
        timer = 'OFF';
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

    // Calculate the count of all questions
    let questionCount = 0;
    let totalImpressions = 0;
    userQuizzes.forEach((quiz) => {
      questionCount += quiz.questions.length;
      totalImpressions += quiz.impressionCount;
    });

    console.log('Question Count:', questionCount);
    console.log('Total Impressions:', totalImpressions);

    res.json({
      quizzes: userQuizzes,
      questionCount: questionCount,
      impressions: totalImpressions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Sumbit a quiz
router.post('/submit', async (req, res) => {
  try {
    // Get the quiz data from the request body
    const { quizId, userResponses } = req.body;

    console.log('Quiz ID:', quizId);
    console.log('User Responses:', userResponses);
    // Create a new UserResponse document for the submitted quiz
    const userResponse = new UserResponse({
      quizId,
      answers: userResponses,
    });

    // Save the user response
    await userResponse.save();

    res.json({ message: 'Quiz submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a quiz
router.delete('/:quizId', isLoggedIn, async (req, res) => {
  try {
    // Get the quiz ID from the request
    const quizId = req.params.quizId;

    // Delete the quiz
    await Quiz.findByIdAndDelete(quizId).exec();

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit quiz
router.put('/:quizId', isLoggedIn, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { title, questions, quizType, timer, optionType, creatorId } =
      req.body;

    // Validate request parameters
    if (
      !title ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0 ||
      !quizType ||
      !optionType ||
      !creatorId
    ) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const updatedOptions = [];
    const updatedQuestions = [];

    for (const { text, options, correctOptionId, _id } of questions) {
      // Validate question data
      if (
        !text ||
        !options ||
        !Array.isArray(options) ||
        options.length === 0
      ) {
        return res.status(400).json({ error: 'Invalid question data' });
      }

      const newOptions = [];
      let correctOptionObjectId = '';

      for (const [index, { text, image, _id }] of options.entries()) {
        // Validate option data
        if (
          (optionType === 'Text' && !text) ||
          ((optionType === 'Text & Image URL' || optionType === 'Image URL') &&
            !image)
        ) {
          return res.status(400).json({ error: 'Invalid option data' });
        }

        const option = _id
          ? await Option.findById(_id).exec()
          : new Option({ text, image });

        if (optionType === 'Text' || optionType === 'Text & Image URL')
          option.text = text;
        else if (
          optionType === 'Image URL' ||
          optionType === 'Text & Image URL'
        )
          option.image = image;

        console.log('Option:', option);
        await option.save();
        newOptions.push(option._id);
        console.log('New Options:', newOptions);
        if (index === correctOptionId) {
          correctOptionObjectId = option._id;
        }
      }

      // save question
      const question = _id
        ? await Question.findByIdAndUpdate(_id, {
            text,
            options: newOptions,
            correctOptionId: correctOptionObjectId,
          }).exec()
        : new Question({
            text,
            options: newOptions,
            correctOptionId: correctOptionObjectId,
          });

      await question.save();

      // console.log('Question:', question);
      updatedQuestions.push(question._id);
      // console.log('Updated Questions:', updatedQuestions);
    }

    // console.log('Updated Options:', updatedOptions);

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        title,
        quizType,
        timer,
        optionType,
        questions: updatedQuestions,
        creatorId,
      },
      { new: true }
    ).exec();

    console.log('Updated Quiz:', updatedQuiz);
    res.json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// exports
module.exports = router;
