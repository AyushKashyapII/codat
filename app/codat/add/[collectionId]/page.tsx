"use client";

import { useParams, useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import hljs from "highlight.js";
import { Upload, Check, FileCode, FileText, Code, Save } from "lucide-react";
import Head from "next/head";
import axios from "axios";
import Loader from "@/components/loader";
import { motion } from "framer-motion";

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
          <h1 className="text-4xl font-extrabold mb-8 text-center">
            Create New Codat
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 h-full">
            <motion.div
              className="lg:w-1/3 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl h-fit"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                What Are Codats?
              </h2>

              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute left-6 top-0 h-full w-1 bg-gray-700"></div>
                  <div className="relative pl-14 pb-8">
                    <div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= 1
                          ? "bg-blue-600 border-blue-400"
                          : "bg-gray-700 border-gray-600"
                      }`}
                    >
                      <FileText size={20} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Basic Information
                    </h3>
                    <p className="text-gray-300">
                      Start by giving your Codat a title and description to help
                      others understand what your code does.
                    </p>
                  </div>

                  <div className="relative pl-14 pb-8">
                    <div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= 2
                          ? "bg-blue-600 border-blue-400"
                          : "bg-gray-700 border-gray-600"
                      }`}
                    >
                      <Code size={20} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Code Input</h3>
                    <p className="text-gray-300">
                      Add your code snippet or upload a file. The system will
                      try to detect the language automatically.
                    </p>
                  </div>


                  <div className="relative pl-14">
                    <div
                      className={`absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= 3
                          ? "bg-blue-600 border-blue-400"
                          : "bg-gray-700 border-gray-600"
                      }`}
                    >
                      <Save size={20} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
                    <p className="text-gray-300">
                      Submit your Codat to save it to your collection and share
                      it with others.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">
                    Why Use Codats?
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Share code snippets with your team</li>
                    <li>Organize code examples in collections</li>
                    <li>Reference solutions to common problems</li>
                    <li>Build a personal library of reusable code</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-2/3 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-lg"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="flex items-center space-x-2 text-sm font-medium mb-2"
                  >
                    <span>Language</span>
                    {detectingLanguage && (
                      <span className="text-xs text-blue-400 animate-pulse">
                        Detecting language...
                      </span>
                    )}
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="code" className="block text-sm font-medium">
                      Code
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                      <Upload size={16} />
                      <span>Upload File</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".js,.py,.java,.cpp,.rb,.go,.rs,.ts,.php,.swift,.txt"
                      />
                    </label>
                  </div>
                  <textarea
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono min-h-[300px]"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
