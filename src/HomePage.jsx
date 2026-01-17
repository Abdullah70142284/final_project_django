import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Quiz from "./components/quiz";
import CreateQuizForm from "./components/CreatQuizForm";
import ListQuizzes from "./components/ListQuizzes";
import { useState, useEffect } from "react";
import { getAllQuizzes, saveQuizzes } from "./services/quizService";
import QuizDashBoard from "./components/Dashboard";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedIn");
    if (!loggedInUser) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getAllQuizzes();
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const handleQuizCreate = async (newQuiz) => {
    try {
      const createdQuiz = await saveQuizzes(newQuiz);
      setQuizzes((prev) => [...prev, createdQuiz]);
      navigate("/home/list");
    } catch (error) {
      alert('Failed to create quiz. Please try again.');
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("loggedIn");
      navigate("/");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        style={{ position: "absolute", top: "10px", left: "10px" }}
        onClick={handleBack}
      >
        Back
      </button>
      <button
        style={{ position: "absolute", top: "10px", right: "10px" }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <Routes>
        
        {/* Home Page */}
        <Route
          path=""
          element={
            <div>
              <h1> Welcome to Quiz App</h1>

              <Link to="create">
                <button style={{ margin: "10px" }}> + Create Quiz</button>
              </Link>
              <Link to="list">
                <button style={{ margin: "10px" }}> Attempt Quiz</button>
              </Link>
              <Link to="results">
                <button style={{ margin: "10px" }}> Result</button>
              </Link>
            </div>
          }
        />

        {/* Create Quiz */}
        <Route
          path="create"
          element={<CreateQuizForm onQuizCreate={handleQuizCreate} />}
        />

        {/* List Quizzes */}
        <Route path="list" element={<ListQuizzes quizzes={quizzes} />} />

        {/* Attempt Quiz */}
        <Route path="quiz/:id" element={<Quiz />} />

        <Route path="results" element={<QuizDashBoard />} />
      </Routes>
    </div>
  );
}

export default Home;
