"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: string;
}

const QuizPage = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "General Knowledge";

  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: number]: boolean }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, [subject]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/generate_quizz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no_of_questions: 10,
          difficulty: "medium",
          topics: [subject],
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch quiz data");

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setQuizData(result.data);
        setUserAnswers({});
        setCheckedAnswers({});
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
      } else throw new Error("Invalid quiz data format");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAnswerClick = (selectedOption: string) => {
    if (checkedAnswers[currentQuestionIndex]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleCheckAnswer = () => {
    if (!userAnswers[currentQuestionIndex]) return;
    setCheckedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: true,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let correctCount = Object.keys(userAnswers).reduce((count, index) => {
        return userAnswers[parseInt(index)] === quizData[parseInt(index)].correct ? count + 1 : count;
      }, 0);
      setScore(correctCount);
      setQuizCompleted(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Quiz Title */}
      <div className="w-full p-4 text-center bg-gray-800 text-2xl font-bold">Quiz</div>

      <div className="flex flex-1">
        {/* Sidebar for Question Numbers */}
        {!quizCompleted && (
          <div className="w-20 bg-gray-800 p-4 flex flex-col items-center">
            {quizData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 flex items-center justify-center rounded-full m-1 text-white ${
                  checkedAnswers[index]
                    ? userAnswers[index] === quizData[index].correct
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Main Quiz Section */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {error && <p className="text-red-500">{error}</p>}

          {!quizCompleted ? (
            <div className="w-full max-w-lg p-4 border border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1} :</h2>

              {quizData.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold">{quizData[currentQuestionIndex].question}</h2>
                  <ul className="mt-2 space-y-2">
                    {quizData[currentQuestionIndex].options.map((option, optIndex) => {
                      const isSelected = userAnswers[currentQuestionIndex] === option;
                      const isCorrectAnswer = option === quizData[currentQuestionIndex].correct;
                      const isChecked = checkedAnswers[currentQuestionIndex];

                      return (
                        <li
                          key={optIndex}
                          className={`relative p-3 rounded cursor-pointer flex justify-between border ${
                            isChecked
                              ? isCorrectAnswer
                                ? "border-green-500"
                                : isSelected
                                ? "border-red-500"
                                : "border-gray-600"
                              : isSelected
                              ? "border-blue-500"
                              : "border-gray-600 hover:bg-gray-800"
                          }`}
                          onClick={() => handleAnswerClick(option)}
                        >
                          <span>{option}</span>

                          {isChecked && (
                            <span className="flex items-center space-x-3 text-xs">
                              {isCorrectAnswer ? (
                                <>
                                  <CheckCircle className="text-green-500 w-8 h-8" />
                                  <span>Correct Answer</span>
                                </>
                              ) : (
                                isSelected && (
                                  <>
                                    <XCircle className="text-red-500 w-8 h-8" />
                                    <span>Your Answer</span>
                                  </>
                                )
                              )}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleCheckAnswer}
                  className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                  disabled={!userAnswers[currentQuestionIndex] || checkedAnswers[currentQuestionIndex]}
                >
                  Check
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!checkedAnswers[currentQuestionIndex]}
                >
                  {currentQuestionIndex === quizData.length - 1 ? "Submit Quiz" : "Next"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <p className="text-xl">{score}/{quizData.length} Correct</p>
              <button onClick={fetchQuiz} className="mt-4 px-6 py-2 bg-green-500 rounded">
                Reattempt Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
