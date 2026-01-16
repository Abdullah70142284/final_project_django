import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateQuizForm = ({ onQuizCreate }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [optionCount, setOptionCount] = useState(0);

  // useEffect(() => {
  // if (optionCount < 2 || optionCount >6){
  //   setQuestions([]);
    
  // }

  // if (questionCount > 0 && optionCount > 0) {
  //   generateQuestions(questionCount, optionCount);
  // }
  // }, [questionCount, optionCount]);

  const navigate = useNavigate();

  const generateQuestions = (totalQuestions, totalOptions) => {
    setQuestions((previousQuestions) => {
      const nextQuestions = [];
        for (let questionIndex = 0; questionIndex < totalQuestions; questionIndex += 1) {
        const previous = previousQuestions[questionIndex] || {
          question: "",
          options: [],
          answer: null,
        };
                                                       
        const nextOptions = [];
        for (let optionIndex = 0; optionIndex < totalOptions; optionIndex += 1) {
          nextOptions.push(previous.options[optionIndex] || "");
        }

        const nextAnswer =
          previous.answer !== null && previous.answer < totalOptions
            ? previous.answer
            : null;

        nextQuestions.push({
          question: previous.question,
          options: nextOptions,
          answer: nextAnswer,
        });
      }

      return nextQuestions;
    });
  };

  const handleAddQuestion = () => {
    if (!quizTitle.trim()) {
      alert("Please enter a quiz title first!");
      return;
    }

    if (optionCount < 2 || optionCount > 6) {
      alert("Options should be between 2 and 6");
      return;
    }

    generateQuestions(Number(questionCount), Number(optionCount));
  };

  const handleQuestionText = (questionIndex, value) => {
    setQuestions((previous) => {
      const updated = [...previous];
      updated[questionIndex].question = value;
      return updated;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((previous) => {
      const updated = [...previous];
      updated[questionIndex].options[optionIndex] = value;
      return updated;
    });
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setQuestions((previous) => {
      const updated = [...previous];
      updated[questionIndex].answer = optionIndex;
      return updated;
    });
  };

  const handleSubmit = () => {
    if (!quizTitle.trim()) {
      alert("Enter Quiz Title first!");
      return;
    }

    const hasIncomplete = questions.some(
      (question) =>
        question.question.trim() === "" ||
        question.options.some((option) => option.trim() === "") ||
        question.answer === null
    );
    if (hasIncomplete) {
      const confirmSave = window.confirm(
        "Some fields are blank. Do you want to continue filling them or save as it is?"
      );
      if (!confirmSave){
        return;
      }
    }

    const finalQuestions = questions
     .filter((q) => q.question.trim() !== "")
     .map((q) => {
        const finalOptions = q.options.filter((opt)=> opt.trim() !=="");
          return{
            question: q.question,
            options: finalOptions,
            answer: q.answer !==null && q.answer < finalOptions.length
            ? q.answer 
            : null,
          };
      })
        .filter ((q) => q.options.length >=2 );

        if (finalQuestions.length ===0){
          alert("No valid questions to save!")
          return;
      }
    onQuizCreate({ title: quizTitle, questions:finalQuestions });

    // Reset
    setQuizTitle("");
    setQuestions([]);
    setQuestionCount(0);
    setOptionCount(0);

    navigate("/home/list");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Your Quiz</h2>

      <label style={{ display: "block", marginBottom: "10px" }}>Title:</label>
      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Enter quiz title"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <label style={{ display: "block", marginBottom: "10px" }}>
        Number of Questions:
      </label>
      <input
        type="number"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
        placeholder="Number of Questions"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <label style={{ display: "block", marginBottom: "10px" }}>
        Options per Question:
      </label>
      <input
        type="number"
        value={optionCount}
        onChange={(e) => setOptionCount(Number(e.target.value))}
        placeholder="Options per Question"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button onClick={handleAddQuestion} style={{ marginBottom: "20px" }}>
        Create Questions
      </button>

      {questions.map((question, questionIndex) => (
        <div key={questionIndex} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={`Question ${questionIndex + 1}`}
            value={question.question}
            onChange={(e) => handleQuestionText(questionIndex, e.target.value)}
            style={{ width: "60%", padding: "8px", marginBottom: "10px" }}
          />

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <input
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(questionIndex, optionIndex, e.target.value)
                }
                style={{ padding: "6px", margin: "4px" }}
              />
              <input
                type="radio"
                name={`correct-${questionIndex}`}
                checked={question.answer === optionIndex}
                onChange={() => handleAnswerChange(questionIndex, optionIndex)}
              />
              Correct
            </div>
          ))}
        </div>
      ))}

      <br />
      <button onClick={handleSubmit} disabled={questions.length === 0}>
        Finish and Create Quiz
      </button>
    </div>
    
  );
  
};

export default CreateQuizForm;
