"use client"

import {useParams, useRouter} from "next/navigation";

export interface CodatFormData {
  title: string;
  description: string;
  language: string;
  code: string;
}


import { useState, ChangeEvent, FormEvent } from 'react';
import { Upload } from 'lucide-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import axios from "axios";

const CreateCodat: NextPage = () => {
  const [formData, setFormData] = useState<CodatFormData>({
    title: '',
    description: '',
    language: '',
    code: ''
  });
  const router = useRouter();
  const params = useParams();
  const collectionId = params.collectionId;

  const languages = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby',
    'Go', 'Rust', 'TypeScript', 'PHP', 'Swift'
  ] as const;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        setFormData(prev => ({ ...prev, code: text }));
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!collectionId || !formData.code || !formData.language || !formData.title) return;
    try {
      const res = await axios.post("/api/codat/create", {
        title: formData.title,
        description: formData.description,
        code: formData.code,
        language: formData.language,
        collectionId
      })

      if (res.status === 200) {
        router.push(`/collections/${collectionId}`)
      }
    } catch (error) {
      console.error('Error creating codat:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Create Codat - Code Sharing Platform</title>
        <meta name="description" content="Create and share your code snippets" />
      </Head>

      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Codat</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
                required
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Language</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="code" className="block text-sm font-medium">Code</label>
                <label className="flex items-center space-x-2 cursor-pointer 
                  px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
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
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none
                  font-mono min-h-[300px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
            >
              Create Codat
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCodat;