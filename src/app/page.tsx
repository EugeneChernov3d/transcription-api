"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("transcribe");
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Compose feature states
  const [composeDescription, setComposeDescription] = useState("");
  const [composedMessage, setComposedMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // Proofread feature states
  const [proofreadText, setProofreadText] = useState("");
  const [proofreadResult, setProofreadResult] = useState("");
  const [isProofreading, setIsProofreading] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const result = await response.json();
      setTranscription(result.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setTranscription("Error transcribing audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompose = async () => {
    if (!composeDescription.trim()) {
      alert("Please enter a description");
      return;
    }

    setIsComposing(true);
    try {
      const response = await fetch("/api/compose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: composeDescription }),
      });

      if (!response.ok) {
        throw new Error("Composition failed");
      }

      const result = await response.json();
      setComposedMessage(result.composedMessage);
    } catch (error) {
      console.error("Error composing message:", error);
      setComposedMessage("Error composing message. Please try again.");
    } finally {
      setIsComposing(false);
    }
  };

  const handleProofread = async () => {
    if (!proofreadText.trim()) {
      alert("Please enter text to proofread");
      return;
    }

    setIsProofreading(true);
    try {
      const response = await fetch("/api/proofread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: proofreadText }),
      });

      if (!response.ok) {
        throw new Error("Proofreading failed");
      }

      const result = await response.json();
      setProofreadResult(result.proofreadText);
    } catch (error) {
      console.error("Error proofreading text:", error);
      setProofreadResult("Error proofreading text. Please try again.");
    } finally {
      setIsProofreading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI Assistant
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("transcribe")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "transcribe"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Transcribe
          </button>
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "compose"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab("proofread")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "proofread"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Proofread
          </button>
        </div>

        {/* Transcribe Tab */}
        {activeTab === "transcribe" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">Audio Transcription</h2>
            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>

              {isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Recording...</span>
                </div>
              )}

              {isLoading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Transcribing...</p>
                </div>
              )}

              {transcription && (
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-2">Transcription:</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{transcription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === "compose" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">Message Composer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe what you want to say:
                </label>
                <textarea
                  value={composeDescription}
                  onChange={(e) => setComposeDescription(e.target.value)}
                  placeholder="Example: I need to tell my team that the meeting is postponed and I will send a new calendar invite soon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              <button
                onClick={handleCompose}
                disabled={isComposing || !composeDescription.trim()}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isComposing ? "Composing..." : "Compose Message"}
              </button>

              {isComposing && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Creating your message...</p>
                </div>
              )}

              {composedMessage && (
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-2">Composed Message:</h3>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{composedMessage}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(composedMessage);
                      alert("Message copied to clipboard!");
                    }}
                    className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proofread Tab */}
        {activeTab === "proofread" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">Proofreader</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text to proofread:
                </label>
                <textarea
                  value={proofreadText}
                  onChange={(e) => setProofreadText(e.target.value)}
                  placeholder="Example: This is a sentance with mistaks that need correcting."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              <button
                onClick={handleProofread}
                disabled={isProofreading || !proofreadText.trim()}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProofreading ? "Proofreading..." : "Proofread Text"}
              </button>

              {isProofreading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Checking your text...</p>
                </div>
              )}

              {proofreadResult && (
                <div className="w-full space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Original Text:</h3>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{proofreadText}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Proofread Text:</h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{proofreadResult}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(proofreadResult);
                      alert("Proofread text copied to clipboard!");
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Copy Corrected Text
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
