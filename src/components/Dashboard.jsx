import { useState, useEffect } from "react";
import "./Dashboard.css"; 

function QuizDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filters, setFilters] = useState({
    username:"",
    quiz: "",
    startDate: "",
    endDate: "",
    minScore: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("attempts")) || [];
    setAttempts(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = [...attempts];

   if (filters.username) {
      result = result.filter((a) => a.username === filters.username);
    }
    
    if (filters.quiz.trim()) {
      result = result.filter((a) =>
        a.quizTitle.toLowerCase().includes(filters.quiz.toLowerCase())
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (a) => new Date(a.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (a) => new Date(a.date) <= new Date(filters.endDate)
      );
    }

    if (filters.minScore) {
      result = result.filter(
        (a) => (a.score / a.total) * 100 >= Number(filters.minScore)
      );
    }

    setFiltered(result);
  }, [filters, attempts]);

  // Helper function for cleaner input handling
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };


  return (
    <div className="dashboard">
      <h2 className="title">Results Dashboard</h2>

      <div className="filters">
        <select
          value={filters.username}
          onChange={(e) => handleFilterChange("username", e.target.value)}
        >
        <option value="">All Users</option>
        {attempts.map((a, i) => (
        <option key={i} value={a.username}>
        {a.username}
        </option>
        ))}
        </select>

        <input
          type="text"
          placeholder="Filter by Quiz"
          value={filters.quiz}
          onChange={(e) => handleFilterChange("quiz", e.target.value)}
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <input
          type="number"
          placeholder="Min % Score"
          value={filters.minScore}
          onChange={(e) => handleFilterChange("minScore", e.target.value)}
        />
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, i) => (
            <tr key={i}>
              <td>{a.username}</td>
              <td>{a.quizTitle}</td>
              <td>
                {a.score}/{a.total} ({Math.round((a.score / a.total) * 100)}%)
              </td>
              <td>{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizDashboard;
