//src>app>landing>testimonials>page.tsx

"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is StudyAI?",
      answer:
        "StudyAI is a revolutionary new platform that allows you to upload your course materials and create interactive study sets. You can study with an AI tutor, create flashcards, generate notes, take practice tests, and more.",
    },
    {
      question: "Can I upload my whole class lecture to StudyAI?",
      answer:
        "Yes, you can upload full lectures, and StudyAI will process them into study materials.",
    },
    {
      question: "What types of course material can I upload?",
      answer:
        "You can upload PDFs, Word documents, PowerPoint presentations, and even handwritten notes.",
    },
    {
      question:
        "Does my course material automatically convert into other features?",
      answer:
        "Yes, AI will process your material to generate flashcards, notes, and quizzes.",
    },
    {
      question: "How do I upload my material?",
      answer:
        "Simply drag and drop your files into the upload section, and AI will handle the rest.",
    },
    {
      question: "How does the AI work?",
      answer:
        "Our AI analyzes your material, extracts key points, and creates personalized study aids.",
    },
    {
      question: "Who is DAll.e?",
      answer:
        "DAll.e is our AI-powered tutor that helps you with your studies in real-time.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="py-16 bg-dark-tech text-white relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-blue-400 mb-8">
          Common Questions
        </h2>
        <p className="text-center text-gray-300 mt-2 mb-10">
          Find answers to frequently asked questions about StudyAI.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-cyan-900 to-pink-900
 p-5 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-xl"
            >
              <button
                className="flex justify-between items-center w-full text-xl font-semibold text-white"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <FaChevronDown
                  className={`transition-transform transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="text-white mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glowing background effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-neon-glow transition-all duration-300 z-[-1]" />
    </section>
  );
}
