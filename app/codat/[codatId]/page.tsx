"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Loader from "@/components/loader"
import axios from "axios"
import { useModel } from "@/hooks/user-model-store"
import { createHighlighter } from "shiki"

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [highlightedCode, setHighlightedCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["catppuccin-mocha"],
          langs: [language.toLowerCase()],
        })

        const highlighted = highlighter.codeToHtml(code, {
          lang: language.toLowerCase(),
          theme: "catppuccin-mocha",
        })

        setHighlightedCode(highlighted)
      } catch (error) {
        console.error("Failed to highlight code:", error)
        setHighlightedCode(`<pre><code>${code}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language])

  if (isLoading) {
    return <div className="bg-gray-800 p-4 rounded-md h-24 animate-pulse" />
  }

  return (
    <div className="p-4 rounded-md overflow-auto text-sm bg-[#1e1e2e]">
      <div
        className="[&_pre]:!bg-transparent [&_code]:!text-[1.1em] [&_.line]:!leading-6 [&_pre]:!p-0 [&_.shiki]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
}

const CodatPage = () => {
  const router = useRouter()
  const { profile, codat, setCodat } = useModel()
  const params = useParams()
  const codatId = params.codatId as string
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    async function fetchCodat() {
      try {
        const res = await axios.get(`/api/codat/${codatId}`)        
        if (res.status === 200) {
          setCodat(res.data)          
        } else {
          router.push("/")
        }
      } catch (e) {
        console.error(e)
        router.push("/")
      }
    }

    if (!codat && codatId) {
      fetchCodat()
    }
  }, [codat, codatId, router, setCodat])

  if (!isClient) return <Loader />
  if (!codat) return <Loader />

  if (!codat?.codatIsPublic && profile?.id !== codat?.codatAuthor?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 text-lg">
            This Codat is private and cannot be viewed.
          </p>
          <motion.button
            className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
            onClick={() => router.back()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {codat.codatName}
      </motion.h1>

      <motion.p
        className="text-gray-400 text-lg mb-4 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {codat.codatDescription}
      </motion.p>

      <motion.div
        className="bg-gray-900 p-4 rounded-xl shadow-lg w-full max-w-3xl border border-gray-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-2">Code:</h2>
        <CodeBlock code={codat.codatCode} language={codat.codatLanguage} />

        <div className="flex justify-between text-gray-400 mt-4">
          <p>Language: {codat.codatLanguage}</p>
          <p>Public: {codat.codatIsPublic ? "Yes" : "No"}</p>
        </div>

        <p className="text-gray-500 mt-2 text-sm">
          Created: {new Date(codat.createdAt).toLocaleDateString()} | Updated:{" "}
          {new Date(codat.updatedAt).toLocaleDateString()}
        </p>
      </motion.div>

      <motion.div
        className="bg-gray-800 p-4 rounded-md shadow-md w-full max-w-3xl border border-gray-600 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
        <p className="text-gray-300 mb-2">Description: {codat.codatAIDesc}</p>
        <CodeBlock code={codat.codatAIFunc} language={codat.codatLanguage} />
      </motion.div>

      {profile?.id === codat?.codatAuthor?.id && (
        <motion.button
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
          onClick={() => router.push(`/edit-club/${codat.codatId}`)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Club
        </motion.button>
      )}

      <motion.button
        className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105 mt-4"
        onClick={() => router.back()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Back
      </motion.button>
    </div>
  )
}

export default CodatPage
