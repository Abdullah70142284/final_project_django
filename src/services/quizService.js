import { submitAttempt, getQuizzes, getQuizById, createQuiz } from './api';

export async function setItemInDb(quizId, quizTitle, score, questions, selectedAnswers) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
  
  const attemptData = {
    user: loggedInUser.id,
    quiz: quizId,
    score: score,
    total_questions: questions.length,
    selected_answers: selectedAnswers
  };
  
  try {
    await submitAttempt(attemptData);
  } catch (error) {
    console.error('Error saving attempt:', error);
    throw error;
  }
}

export async function saveQuizzes(quizData) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
  
  const payload = {
    title: quizData.title,
    created_by: loggedInUser.id,
    questions: quizData.questions.map((q, idx) => ({
      question_text: q.question,
      options: q.options,
      correct_answer: q.answer,
      order: idx
    }))
  };
  
  console.log('Quiz payload being sent:', payload);
  
  try {
    const quiz = await createQuiz(payload);
    return quiz;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
}

export async function getAllQuizzes() {
  try {
    return await getQuizzes();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
}

export async function getQuizByIdFromAPI(id) {
  try {
    return await getQuizById(id);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
}
