
const Question = ({ questionData, currentIndex, total, selectedAnswer, onSelect }) => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        
    }}>
      <h2>Question {currentIndex + 1} of {total}</h2>
      <p>{questionData.question}</p>
      <div>
        {questionData.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              backgroundColor: selectedAnswer === i ? 'pink': 'brown',
              margin: '5px',
              padding: '10px',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
