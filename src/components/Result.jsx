const Result = ({score,questions, selectedAnswers }) => {
  return (
    <div>
      <h2>Quiz Result</h2>
      <p>You scored {score} out of {questions.length}</p>
      {questions.map((q, index) => {
        const userIndex = selectedAnswers[index];
        const userAnswer = userIndex !== null ? q.options[userIndex] : "No Answer";
        const correctAnswer = q.options[q.answer];
        const isCorrect = userIndex === q.answer;

        return (
          <p key={index}>
            Q{index + 1}: Your Answer = {userAnswer} | Correct Answer = {correctAnswer} <strong>{isCorrect ? '✅' : '❌'}</strong>
          </p>
        );
      })}
    </div>
  );
};

export default Result;
