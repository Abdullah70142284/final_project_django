import { Link } from "react-router-dom";

const ListQuizzes = ({ quizzes }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Quizzes:</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes yet. Create one to get started.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#7a7373ff" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Title
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                No. of Questions
              </th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((qz) => (
              <tr key={qz.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {qz.title}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {qz.questions.length}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <Link to={`../quiz/${qz.id}`}>
                    <button style={{ padding: "6px 12px" }}>Attempt</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListQuizzes;
