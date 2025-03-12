"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useModel } from "@/hooks/user-model-store"
import { createHighlighter } from "shiki"
import Loader from "@/components/loader"
import { ArrowLeft, Code, FileText } from "lucide-react"

const TAG_STORAGE_KEY = "visitedTags";
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; 

const saveTagsToLocalStorage = (tags: string[]) => {
  const storedData = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY) || "{}");
  let storedTags = storedData?.tags || [];

  if (!storedTags.length) {
    storedTags = tags;
  } else {
    storedTags = Array.from(new Set([...storedTags, ...tags])).slice(-15);
  }

  const expiresAt = Date.now() + EXPIRY_TIME;

  const dataToStore = { tags: storedTags, timestamp: Date.now(), expiresAt };
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(dataToStore));
};


const useHighlightedCode = (code: string, language: string) => {
  const [highlightedCode, setHighlightedCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-dark"],
          langs: [language.toLowerCase()],
        })

        const highlighted = highlighter.codeToHtml(code, {
          lang: language.toLowerCase(),
          theme: "github-dark",
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

  return { highlightedCode, isLoading }
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const { highlightedCode, isLoading } = useHighlightedCode(code, language)

  if (isLoading) {
    return <div className="bg-[#0d1117] p-4 rounded-md h-24 animate-pulse" />
  }

  return (
    <div className="p-4 rounded-md overflow-auto text-sm bg-[#0d1117] max-h-[calc(100vh-12rem)] shadow-lg w-full">
      <div
        className="[&_pre]:!bg-transparent [&_code]:!text-[1.1em] [&_.line]:!leading-6 [&_pre]:!p-0 [&_.shiki]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
}

const CodatPage = () => {
  const router = useRouter()
  const { codat, setCodat } = useModel()
  const params = useParams()
  const codatId = params.codatId as string
  const [isClient, setIsClient] = useState(false)
  const [showAIFunction, setShowAIFunction] = useState(false)
  const { isSignedIn, user } = useUser()

  const userEmail = user?.emailAddresses[0].emailAddress

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    async function fetchCodat() {
      try {
        const res = await axios.get(`/api/codat/${codatId}`)
        if (res.status === 200) {
          setCodat(res.data)
          console.log(res.data.codatTags);
          
          if(res.data.codatTags.length){
            saveTagsToLocalStorage(res.data.codatTags);
          }
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

  if (!isSignedIn && !codat?.codatIsPublic && userEmail !== codat?.codatAuthor?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 text-lg">This Codat is private and cannot be viewed.</p>
          <Button variant="outline" className="mt-6" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <div className="flex flex-col justify-between h-full bg-gray-800 rounded-lg p-6 shadow-lg">
            <div>
              <h1 className="text-3xl font-bold mb-4">{codat.codatName}</h1>
              <p className="text-lg text-gray-300">{codat.codatAIDesc}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p><strong>Language:</strong> {codat.codatLanguage}</p>
              <p><strong>Author:</strong> {codat.codatAuthor?.email}</p>
              <p><strong>Visibility:</strong> {codat.codatIsPublic ? "Public" : "Private"}</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-full">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setShowAIFunction(!showAIFunction)}
                className="flex items-center"
              >
                {showAIFunction ? (
                  <>
                    <Code className="mr-2 h-4 w-4" /> View Code
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" /> View AI Function
                  </>
                )}
              </Button>
            </div>

            <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg h-full">
              {showAIFunction ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">AI Function</h2>
                  <p className="text-gray-300">{codat.codatAIFunc || "AI function not available."}</p>
                </>
              ) : (
                <CodeBlock code={codat.codatCode} language={codat.codatLanguage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodatPage
