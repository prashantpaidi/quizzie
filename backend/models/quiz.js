const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String },
});

const Option = mongoose.model('Option', optionSchema);

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  correctOptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
});

const Question = mongoose.model('Question', questionSchema);

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  quizType: {
    type: String,
    enum: ['Q & A', 'Poll Type'],
    required: true,
  },
  timer: {
    type: String,
    enum: ['OFF', '5 Sec', '10 Sec'],
    required: true,
  },
  optionType: {
    type: String,
    enum: ['Text', 'Image URL', 'Text & Image URL'],
    required: true,
  },
  impressionCount: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  created_at: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', quizSchema);

const userResponseSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedOptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

const UserResponse = mongoose.model('UserResponse', userResponseSchema);

module.exports = { Option, Question, Quiz, UserResponse };
