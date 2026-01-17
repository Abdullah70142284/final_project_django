import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Result from "./result";
import Question from "./Question";
import { setItemInDb, getQuizByIdFromAPI } from "../services/quizService";

function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await getQuizByIdFromAPI(id);
      if (data) {
        // Transform API response to match component expectations
        const transformedQuiz = {
          id: data.id,
          title: data.title,
          questions: data.questions.map(q => ({
            question: q.question_text,
            options: q.options,
            answer: q.correct_answer
          }))
        };
        setQuiz(transformedQuiz);
        setSelectedAnswers(Array(transformedQuiz.questions.length).fill(null));
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const questions = quiz.questions;

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

  const handleBackToHome = () => {
    navigate("/home");
  };

  const showScore = () => {
    return questions.reduce((totalScore, q, index) => {
      return selectedAnswers[index] === q.answer ? totalScore + 1 : totalScore;
    }, 0);
  };

  const handleSubmit = async () => {
    const score = showScore();
    try {
      await setItemInDb(quiz.id, quiz.title, score, questions, selectedAnswers);
      setShowResult(true);
    } catch (error) {
      alert('Failed to submit quiz. Please try again.');
    }
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
