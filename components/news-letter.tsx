"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import React from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const subscribeToNewsletter = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/add-email-for-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        const { error } = await response.json();
        setErrorMessage(error || "Failed to subscribe");
        setStatus("error");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="pr-4">
      <div>
        <h3 className="font-bold mb-4 sm:mb-2 text-white">
          Subscribe to our newsletter
        </h3>
        <p className="text-gray-400 my-2 w-full sm:w-[50vw] md:w-[50vw]">
          Join our DevPool to receive curated job matches via email
        </p>
        <div className="flex space-x-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className={`w-full sm:w-[50vw] md:w-[50vw] px-4 py-2 border rounded-md focus:outline-none bg-gray-900 focus:ring-2 ${
              status === "error"
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            disabled={status === "loading" || status === "success"}
          />
          <button
            onClick={subscribeToNewsletter}
            className="bg-red-600 text-white px-4 py-2"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
                ? "Subscribed!"
                : "Subscribe"}
          </button>
        </div>
        {status === "error" && (
          <div className="sm:w-[200%] md:w-[170%] flex items-center mt-2 text-red-500 text-sm">
            <AlertCircle className=" h-4 mr-1" />
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsLetter;
