"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useModel } from "@/hooks/user-model-store";
import { createHighlighter } from "shiki";
import Loader from "@/components/loader";
import {
  ArrowLeft,
  Code,
  FileText,
  Globe,
  Lock,
  PenSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-dark"],
          langs: [language.toLowerCase()],
        });

        const highlighted = highlighter.codeToHtml(code, {
          lang: language.toLowerCase(),
          theme: "github-dark",
        });

        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  return { highlightedCode, isLoading };
};

function DisplayAIResponse({ text }: { text: string }) {
  return <ReactMarkdown>{text}</ReactMarkdown>;
}

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleCopy}
      className="h-8 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors flex items-center gap-1"
    >
      {isCopied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Copy code</span>
        </>
      )}
    </Button>
  );
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const { highlightedCode, isLoading } = useHighlightedCode(code, language);
  const [showCopyButton, setShowCopyButton] = useState(false);

  if (isLoading) {
    return <div className="bg-[#0d1117] p-4 rounded-md h-24 animate-pulse" />;
  }

  return (
    <div 
      className="relative p-4 rounded-md overflow-auto text-sm bg-[#0d1117] max-h-[calc(100vh-12rem)] shadow-lg w-full"
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      {showCopyButton && (
        <div className="absolute top-4 right-4 z-10">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="[&_pre]:!bg-transparent [&_code]:!text-[1.1em] [&_.line]:!leading-6 [&_pre]:!p-0 [&_.shiki]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
};

const CodatPage = () => {
  const router = useRouter();
  const { codat, setCodat } = useModel();
  const [isPublic, setIsPublic] = useState(true);
  const params = useParams();
  const codatId = params.codatId as string;
  const [isClient, setIsClient] = useState(false);
  const [showAIFunction, setShowAIFunction] = useState(false);
  const { isSignedIn, user } = useUser();

  const handleVisiblity = async () => {
    try {
      const res = await axios.patch(`/api/codat/${codatId}`, {
        isPublic: !isPublic,
      });
      setCodat(res.data.codat);
      setIsPublic((value) => !value);
    } catch (error) {
      console.log("error", error);
    }
  };

  const userEmail = user?.emailAddresses[0].emailAddress;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchCodat() {
      try {
        const res = await axios.get(`/api/codat/${codatId}`);
        if (res.status === 200) {
          setCodat(res.data);
          console.log(res.data.codatTags);

          if (res.data.codatTags.length) {
            saveTagsToLocalStorage(res.data.codatTags);
          }
          setIsPublic(res.data.codatIsPublic);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error(e);
        router.push("/");
      }
    }

    if (!codat && codatId) {
      fetchCodat();
    }
  }, [codatId, router, setCodat, location]);

  if (!isClient) return <Loader />;
  if (!codat) return <Loader />;

  if (
    !isSignedIn &&
    !codat?.codatIsPublic &&
    userEmail !== codat?.codatAuthor?.email
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 text-lg">
            This Codat is private and cannot be viewed.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <div className="">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={handleVisiblity}
              className="flex items-center ml-3 hover:bg-blue-500"
            >
              {isPublic ? (
                <>
                  <Lock className="mr-2 h-4 w-4 text-black" />
                  <p className="text-black">Make Codat Private</p>
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4 text-black" />{" "}
                  <p className="text-black">Make Codat Public</p>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(`/codat/edit/${codatId}`)}
              className="flex items-center ml-3 hover:bg-blue-500"
            >
              <PenSquare className="mr-2 h-4 w-4 text-black" />
              <p className="text-black">Edit</p>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAIFunction(!showAIFunction)}
              className="flex items-center ml-3 hover:bg-blue-500"
            >
              {showAIFunction ? (
                <>
                  <Code className="mr-2 h-4 w-4 text-black" />
                  <p className="text-black">View Code</p>
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4 text-black" />{" "}
                  <p className="text-black">View AI Function</p>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <div className="flex flex-col justify-between h-full bg-gray-800 rounded-lg p-6 shadow-lg">
            <div>
              <h1 className="text-3xl font-bold mb-4">{codat.codatName}</h1>
              <p className="text-lg text-gray-300">{codat.codatAIDesc}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p>
                <strong>Language:</strong> {codat.codatLanguage}
              </p>
              <p>
                <strong>Author:</strong> {codat.codatAuthor?.email}
              </p>
              <p>
                <strong>Visibility:</strong>{" "}
                {codat.codatIsPublic ? "Public" : "Private"}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-full">
            <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg h-full">
              {showAIFunction ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">AI Function</h2>
                  <p className="text-gray-300">
                    {codat.codatAIFunc ? (
                      <DisplayAIResponse text={codat.codatAIFunc} />
                    ) : (
                      "AI function not available."
                    )}
                  </p>
                </>
              ) : (
                <CodeBlock
                  code={codat.codatCode}
                  language={codat.codatLanguage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodatPage;