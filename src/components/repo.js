export function setItemInDb(quizId, quizTitle,score,questions,selectedAnswers){
const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
const resultData = {
        username: loggedInUser ? loggedInUser.username : "Guest",
        quizId: quizId,
        quizTitle: quizTitle, 
        date: new Date().toLocaleString(),
        score: score,
        total: questions.length,
        answers: selectedAnswers
      };
      const existingAttempts = JSON.parse(localStorage.getItem('attempts')) || [];
      existingAttempts.push(resultData);
      localStorage.setItem("attempts", JSON.stringify(existingAttempts));
}

export function saveQuizzes(quizzes) {
  localStorage.setItem("CustomQuizzes",JSON.stringify(quizzes));
}

export function getQuizzes(){
  return JSON.parse(localStorage.getItem("CustomQuizzes")) || [];
}
//Add new quiz:
export function addQuiz (newQuiz){
  const existing = getQuizzes();
  const quizWithId = {...newQuiz, id: Date.now().toString()};
  const updated = [...existing,quizWithId];
  saveQuizzes(updated);
  return quizWithId;
}
//get quiz by id:
export function getQuizById(id){
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.id ===id);
}