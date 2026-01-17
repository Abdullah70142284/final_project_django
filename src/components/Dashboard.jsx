import { useState, useEffect } from "react";
import { getAttempts } from "../services/api";
import "./Dashboard.css"; 

function QuizDashboard() {
  const [filtered, setFiltered] = useState([]);
  const [allUsernames, setAllUsernames] = useState([]);

  const [filters, setFilters] = useState({
    username: "",
    quiz: "",
    startDate: "",
    endDate: "",
    minScore: "",
  });

  useEffect(() => {
    const fetchAttempts = async () => {
      const data = await getAttempts();
      setFiltered(data);
      
      const usernames = [...new Set(data.map(a => a.username))];
      setAllUsernames(usernames);
    };
    fetchAttempts();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      const filterParams = {};
      
      if (filters.username) filterParams.username = filters.username;
      if (filters.quiz.trim()) filterParams.quiz_title = filters.quiz;
      if (filters.startDate) filterParams.start_date = filters.startDate;
      if (filters.endDate) filterParams.end_date = filters.endDate;
      if (filters.minScore) filterParams.min_score = filters.minScore;
      
      const data = await getAttempts(filterParams);
      setFiltered(data);
    };
    
    applyFilters();
  }, [filters]);

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
          {allUsernames.map((username, i) => (
            <option key={i} value={username}>
              {username}
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
              <td>{a.quiz_title}</td>
              <td>
                {a.score}/{a.total_questions} ({Math.round((a.score / a.total_questions) * 100)}%)
              </td>
              <td>{new Date(a.attempted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizDashboard;
