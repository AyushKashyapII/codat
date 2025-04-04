"use client";

import { useParams, useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import hljs from "highlight.js";
import {
  Upload,
  Check,
  FileCode,
  FileText,
  Code,
  Save,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Bookmark,
  Share2,
  Database,
  Terminal,
  GitBranch,
  Lock,
} from "lucide-react";
import Head from "next/head";
import axios from "axios";
import Loader from "@/components/loader";
import { motion, AnimatePresence } from "framer-motion";

export interface CodatFormData {
  title: string;
  description: string;
  language: string;
  code: string;
}

const CreateCodat: NextPage = () => {
  const [formData, setFormData] = useState<CodatFormData>({
    title: "",
    description: "",
    language: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [detectingLanguage, setDetectingLanguage] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeInfoCard, setActiveInfoCard] = useState(0);
  const infoCardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId;

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "Go",
    "Rust",
    "TypeScript",
    "PHP",
    "Swift",
  ] as const;

  const infoCards = [
    {
      title: "Share Knowledge Effortlessly",
      icon: <Share2 size={24} />,
      content:
        "Codats make it simple to share your programming solutions, tricks, and patterns with your team or the world.",
      visual: "sharing-illustration",
    },
    {
      title: "Build Your Code Library",
      icon: <Database size={24} />,
      content:
        "Create a personal collection of reusable code snippets that you can access whenever you need them.",
      visual: "library-illustration",
    },
    {
      title: "Learn From Others",
      icon: <Lightbulb size={24} />,
      content:
        "Discover solutions to common programming challenges from other developers in the community.",
      visual: "learning-illustration",
    },
    {
      title: "Organize By Collections",
      icon: <Bookmark size={24} />,
      content:
        "Group related Codats into collections for better organization and faster access when you need them.",
      visual: "organize-illustration",
    },
    {
      title: "Secure Sharing",
      icon: <Lock size={24} />,
      content:
        "Control who can view and use your Codats with flexible permission settings for teams and individuals.",
      visual: "security-illustration",
    },
  ];

  const languagesDetection = (code: string) => {
    let language = "unknown";
    try {
      const result = hljs.highlightAuto(code);
      language = result.language || "unknown";
      console.log("Detected language:", language);

      const languageMap: Record<string, string> = {
        javascript: "JavaScript",
        typescript: "TypeScript",
        python: "Python",
        java: "Java",
        cpp: "C++",
        ruby: "Ruby",
        go: "Go",
        rust: "Rust",
        php: "PHP",
        swift: "Swift",
      };

      return languageMap[language] || language;
    } catch (error) {
      console.error("Language detection failed:", error);
    }
    return language;
  };

  // Start cycling through info cards
  useEffect(() => {
    infoCardIntervalRef.current = setInterval(() => {
      setActiveInfoCard((prev) => (prev + 1) % infoCards.length);
    }, 5000);

    return () => {
      if (infoCardIntervalRef.current) {
        clearInterval(infoCardIntervalRef.current);
      }
    };
  }, [infoCards.length]);

  // Pause cycling when user interacts with info cards
  const pauseInfoCardCycle = () => {
    if (infoCardIntervalRef.current) {
      clearInterval(infoCardIntervalRef.current);
    }
  };

  // Resume cycling after user interaction
  const resumeInfoCardCycle = () => {
    if (infoCardIntervalRef.current) {
      clearInterval(infoCardIntervalRef.current);
    }
    infoCardIntervalRef.current = setInterval(() => {
      setActiveInfoCard((prev) => (prev + 1) % infoCards.length);
    }, 5000);
  };

  useEffect(() => {
    const detectLanguage = async () => {
      if (formData.code.trim().length > 20) {
        setDetectingLanguage(true);

        setTimeout(() => {
          const detectedLang = languagesDetection(formData.code);
          setFormData((prev) => ({ ...prev, language: detectedLang }));
          setDetectingLanguage(false);
        }, 500);
      }
    };

    detectLanguage();
  }, [formData.code]);

  // Update current step based on form completion
  useEffect(() => {
    if (formData.title && formData.description) {
      setCurrentStep(2);
      if (formData.language && formData.code) {
        setCurrentStep(3);
      }
    } else {
      setCurrentStep(1);
    }
  }, [formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        setFormData((prev) => ({ ...prev, code: text }));
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!collectionId || !formData.code || !formData.title) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/codat/", {
        title: formData.title,
        description: formData.description,
        code: formData.code,
        language: formData.language,
        collectionId,
      });

      if (res.status === 200) {
        router.push(`/collections/${collectionId}`);
      }
    } catch (error) {
      console.error("Error creating codat:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Create Codat - Code Sharing Platform</title>
        <meta
          name="description"
          content="Create and share your code snippets"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-6 px-4">
        <div className="container mx-auto">
          <motion.h1
            className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Create New Codat
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-8 h-full">
            <motion.div
              className="lg:w-1/3 bg-gray-800/80 p-6 rounded-2xl border border-gray-700 shadow-xl h-fit backdrop-blur-sm relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Dynamic Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

              <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                <Sparkles className="mr-2" size={20} />
                What Are Codats?
              </h2>

              {/* Interactive Timeline */}
              <div className="space-y-8 mb-10">
                <div className="relative">
                  <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

                  <motion.div
                    className="relative pl-14 pb-8"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                        currentStep >= 1
                          ? "bg-blue-600 border-blue-400 shadow-blue-500/50"
                          : "bg-gray-700 border-gray-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FileText size={20} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      Basic Information
                      {currentStep >= 1 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2 text-green-400"
                        >
                          {currentStep > 1 ? (
                            <Check size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-gray-300">
                      Start by giving your Codat a title and description to help
                      others understand what your code does.
                    </p>
                  </motion.div>

                  <motion.div
                    className="relative pl-14 pb-8"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <motion.div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                        currentStep >= 2
                          ? "bg-purple-600 border-purple-400 shadow-purple-500/50"
                          : "bg-gray-700 border-gray-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Terminal size={20} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      Code Input
                      {currentStep >= 2 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2 text-green-400"
                        >
                          {currentStep > 2 ? (
                            <Check size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-gray-300">
                      Add your code snippet or upload a file. The system will
                      try to detect the language automatically.
                    </p>
                  </motion.div>

                  <motion.div
                    className="relative pl-14"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <motion.div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                        currentStep >= 3
                          ? "bg-pink-600 border-pink-400 shadow-pink-500/50"
                          : "bg-gray-700 border-gray-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Save size={20} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      Save & Share
                      {currentStep >= 3 && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2 text-green-400"
                        >
                          <ChevronRight size={16} />
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-gray-300">
                      Submit your Codat to save it to your collection and share
                      it with others.
                    </p>
                  </motion.div>
                </div>

                {/* Rotating Info Cards Section */}
                <div
                  className="mt-12 h-64 relative"
                  onMouseEnter={pauseInfoCardCycle}
                  onMouseLeave={resumeInfoCardCycle}
                >
                  <h3 className="text-lg font-semibold mb-6 text-blue-400 flex items-center">
                    <Lightbulb className="mr-2" size={18} />
                    Why Use Codats?
                  </h3>

                  <div className="relative h-48">
                    <AnimatePresence mode="wait">
                      {infoCards.map((card, index) => (
                        <motion.div
                          key={card.title}
                          className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg overflow-hidden
                            ${
                              activeInfoCard === index
                                ? "z-10"
                                : "z-0 pointer-events-none"
                            }`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={
                            activeInfoCard === index
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: 50 }
                          }
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-start">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3 mt-1">
                              {card.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">
                                {card.title}
                              </h4>
                              <p className="text-gray-300 text-sm">
                                {card.content}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg text-sm text-gray-300 border border-gray-700/50">
                            <div className="flex items-center">
                              <Code className="mr-2" size={16} />
                              <span>
                                Pro Tip:{" "}
                                {index === 0
                                  ? "Use descriptive titles to make your code more discoverable."
                                  : index === 1
                                  ? "Add tags to your Codats to find them quickly later."
                                  : index === 2
                                  ? "Check the trending Codats for popular solutions."
                                  : index === 3
                                  ? "Use collections to organize related code snippets."
                                  : index === 4
                                  ? "Save iterations of your snippets as you improve them."
                                  : "Share private Codats with just your team members."}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Card Indicators */}
                  <div className="flex justify-center mt-2 space-x-1">
                    {infoCards.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          activeInfoCard === index
                            ? "bg-blue-500"
                            : "bg-gray-600"
                        }`}
                        onClick={() => setActiveInfoCard(index)}
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-2/3 bg-gray-800/80 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-lg relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full -ml-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-500/5 rounded-full -mr-20 -mb-20 blur-3xl"></div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <FileCode size={16} className="mr-2 text-blue-400" />
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2 flex items-center"
                  >
                    <FileText size={16} className="mr-2 text-blue-400" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px] transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label
                    htmlFor="language"
                    className="flex items-center space-x-2 text-sm font-medium mb-2"
                  >
                    <Code size={16} className="text-blue-400" />
                    <span>Language</span>
                    {detectingLanguage && (
                      <motion.span
                        className="text-xs text-blue-400 flex items-center"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          repeatType: "reverse",
                        }}
                      >
                        <Sparkles size={12} className="mr-1" />
                        Detecting language...
                      </motion.span>
                    )}
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                    required
                  >
                    <option value="">Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium flex items-center"
                    >
                      <Terminal size={16} className="mr-2 text-blue-400" />
                      Code
                    </label>
                    <motion.label
                      className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(55, 65, 81, 1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload size={16} />
                      <span>Upload File</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".js,.py,.java,.cpp,.rb,.go,.rs,.ts,.php,.swift,.txt"
                      />
                    </motion.label>
                  </div>
                  <textarea
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900/80 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono min-h-[300px] transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition transform hover:shadow-lg hover:from-blue-500 hover:to-purple-500 flex items-center justify-center gap-2"
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <FileCode size={20} />
                  <span>Create Codat</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCodat;
