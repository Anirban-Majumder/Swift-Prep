"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Rocket, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react";
import Confetti from "react-confetti";
import useSound from "use-sound";

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
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sound effects
  const [playCorrect] = useSound("/sounds/correct.mp3");
  const [playIncorrect] = useSound("/sounds/incorrect.mp3");
  const [playClick] = useSound("/sounds/click.mp3");

  useEffect(() => {
    fetchQuiz();
  }, [subject]);

  useEffect(() => {
    if (quizCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
    }
  }, [quizCompleted]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const Loader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse">
          <Rocket className="text-blue-500 w-16 h-16 animate-float" />
        </div>
        <p className="text-white text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          LOADING QUIZ...
        </p>
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );

  const handleAnswerClick = (selectedOption: string) => {
    if (checkedAnswers[currentQuestionIndex]) return;
    playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleCheckAnswer = () => {
    if (!userAnswers[currentQuestionIndex]) return;
    const isCorrect = userAnswers[currentQuestionIndex] === quizData[currentQuestionIndex].correct;
    if (isCorrect) playCorrect();
    else playIncorrect();
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

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-['Poppins'] overflow-hidden">
      {/* Confetti */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.2} />}

      {/* Quiz Title */}
      <div className="w-full p-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-4xl font-bold tracking-wider uppercase shadow-lg">
        {subject} QUIZ
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Question Numbers */}
        {!quizCompleted && (
          <div className="w-24 bg-gray-800 p-4 flex flex-col items-center space-y-2 overflow-y-auto">
            {quizData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all duration-300 ${
                  checkedAnswers[index]
                    ? userAnswers[index] === quizData[index].correct
                      ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                } shadow-md hover:shadow-lg`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Main Quiz Section */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center overflow-y-auto">
          {error && <p className="text-red-500 text-xl">{error}</p>}

          {!quizCompleted ? (
            <div className="w-full max-w-2xl p-8 border border-gray-700 rounded-xl bg-gray-800 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 uppercase bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Question {currentQuestionIndex + 1}
              </h2>

              {quizData.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">
                    {quizData[currentQuestionIndex].question}
                  </h2>
                  <ul className="space-y-4">
                    {quizData[currentQuestionIndex].options.map((option, optIndex) => {
                      const isSelected = userAnswers[currentQuestionIndex] === option;
                      const isCorrectAnswer = option === quizData[currentQuestionIndex].correct;
                      const isChecked = checkedAnswers[currentQuestionIndex];

                      return (
                        <li
                          key={optIndex}
                          className={`relative p-4 rounded-lg cursor-pointer flex justify-between items-center border-2 transition-all duration-300 ${
                            isChecked
                              ? isCorrectAnswer
                                ? "border-green-500 bg-green-900"
                                : isSelected
                                ? "border-red-500 bg-red-900"
                                : "border-gray-700"
                              : isSelected
                              ? "border-blue-500 bg-blue-900"
                              : "border-gray-700 hover:bg-gray-700"
                          } shadow-md hover:shadow-lg`}
                          onClick={() => handleAnswerClick(option)}
                        >
                          <span className="text-lg">{option}</span>

                          {isChecked && (
                            <span className="flex items-center space-x-3">
                              {isCorrectAnswer ? (
                                <>
                                  <CheckCircle className="text-green-500 w-6 h-6" />
                                  <span className="text-green-500 text-sm">Correct</span>
                                </>
                              ) : (
                                isSelected && (
                                  <>
                                    <XCircle className="text-red-500 w-6 h-6" />
                                    <span className="text-red-500 text-sm">Incorrect</span>
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

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center space-x-2 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleCheckAnswer}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-300"
                  disabled={!userAnswers[currentQuestionIndex] || checkedAnswers[currentQuestionIndex]}
                >
                  Check Answer
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2 transition-all duration-300"
                >
                  <span>{currentQuestionIndex === quizData.length - 1 ? "Submit" : "Next"}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 uppercase bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Quiz Completed!
              </h2>
              <p className="text-2xl mb-6">
                You scored <span className="text-blue-500">{score}</span> out of{" "}
                <span className="text-green-500">{quizData.length}</span>
              </p>
              <button
                onClick={fetchQuiz}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 flex items-center space-x-2 mx-auto transition-all duration-300"
              >
                <RefreshCw className="w-6 h-6" />
                <span>Reattempt Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;