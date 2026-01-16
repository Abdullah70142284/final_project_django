import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Quiz from "./components/quiz";
import CreateQuizForm from "./components/CreatQuizForm";
import ListQuizzes from "./components/ListQuizzes";
import { useState, useEffect } from "react";
import { getQuizzes, addQuiz } from "./components/repo";
import QuizDashBoard from "./components/Dashboard";
import axios from "axios";

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [backendMessage, setBackendMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get("http://localhost:5000/home");
        setBackendMessage(res.data.message);
      } catch (err) {
        console.error("Error connecting to backend:", err);
      }
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedIn");
    if (!loggedInUser) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setQuizzes(getQuizzes());
  }, []);

  const handleQuizCreate = (newQuiz) => {
    const quizWithId = addQuiz(newQuiz);
    setQuizzes((prev) => [...prev, quizWithId]);
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
      <p>Backend says: {backendMessage}</p>
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
