import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Result from "./result";
import Question from "./Question";
import { setItemInDb, getQuizById } from "./repo";

function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const quiz = getQuizById(id); //using repo.js

  if (!quiz) return <p>Quiz not found.</p>;

  const questions = quiz.questions;

  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[current] = index;
    setSelectedAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (selectedAnswers[current] === null) {
      alert("Please select an option");
      return;
    }
    setCurrent((prev) => prev + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  const handleBackToHome =()=>{
    navigate("/home");
  };

  const showScore = () => {
    return questions.reduce((totalScore, q, index) => {
      return selectedAnswers[index] === q.answer ? totalScore + 1 : totalScore;
    }, 0);
  };

  const handleSubmit = () => {
    const score = showScore();
    setItemInDb(quiz.id, quiz.title,score, questions, selectedAnswers);
    setShowResult(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!showResult ? (
        <>
          <h2>{quiz.title}</h2>
          <Question
            questionData={questions[current]}
            currentIndex={current}
            total={questions.length}
            selectedAnswer={selectedAnswers[current]}
            onSelect={handleSelect}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={prevQuestion} disabled={current === 0}>
              Previous
            </button>
            <button
              onClick={
                current === questions.length - 1 ? handleSubmit : nextQuestion
              }
            >
              {current === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <>
          <Result
            score={showScore()}
            questions={questions}
            selectedAnswers={selectedAnswers}
          />
          <button onClick={handleBackToHome}>Home</button>
        </>
      )}
    </div>
  );
}

export default Quiz;
