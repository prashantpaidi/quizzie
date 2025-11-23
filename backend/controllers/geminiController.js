const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the desired structure for a single question using Zod
const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
});

// Define the schema for the array of questions
const questionsArraySchema = z.array(questionSchema).length(5);

// Convert the Zod schema to a JSON schema
const jsonSchema = zodToJsonSchema(questionsArraySchema);

// The Gemini API does not support `$schema` or `additionalProperties` in the schema, so we remove them.
delete jsonSchema.$schema;
if (jsonSchema.items) {
  delete jsonSchema.items.additionalProperties;
}

const generateQuestions = async (req, res) => {
  try {
    const { title, quizType } = req.body;
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
    let prompt;
    let schema;
    if (quizType === 'Poll Type') {
      const pollQuestionSchema = z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
      });
      const pollQuestionsArraySchema = z.array(pollQuestionSchema).length(5);
      schema = zodToJsonSchema(pollQuestionsArraySchema);
      delete schema.$schema;
      if (schema.items) {
        delete schema.items.additionalProperties;
      }
      prompt = `Generate 5 poll questions about ${title}. Each question should have 4 options.`;
    } else {
      schema = jsonSchema;
      prompt = `Generate 5 multiple choice questions about ${title}. Each question should have 4 options and 1 correct answer.`;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    const response = await result.response;
    const questions = JSON.parse(response.text());
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
};

module.exports = { generateQuestions };