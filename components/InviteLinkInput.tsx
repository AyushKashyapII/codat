import React, { useState } from "react";
import { useRouter } from "next/navigation";

const InviteLinkInput = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inviteLink) return;

    setIsSubmitting(true);

    try {
 
      router.push(`/teams/join/${inviteLink}`);
    } catch (error) {
      console.error("Invalid invite link:", error);
      setIsSubmitting(false);
   
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Join Team</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Paste your invite link here
            </label>

            <div className="relative">
              <input
                type="password" 
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Paste invite link..."
                className="w-full px-4 py-2 bg-gray-900 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              The invite link will remain hidden for security
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inviteLink}
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isSubmitting || !inviteLink
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Join Team"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteLinkInput;
