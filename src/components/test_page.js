"use client"

import { useState, useRef } from "react"
import { BarChart2, RotateCcw, Upload, FileText, CheckCircle2, Loader2 } from "lucide-react"

// Tariff PDF Upload Card component
function TariffPdfUploadCard({ title, onPdfUpload, uploadedFile, isLoading, error }) {
  const pdfInputRef = useRef(null);

  const handlePdfButtonClick = () => pdfInputRef.current.click();

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
      <div className="flex flex-row items-center gap-2 p-4 border-b border-gray-700">
        <Upload className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 grid gap-4">
        <div className="grid grid-cols-1 gap-4">
          <button
            className="flex flex-col items-center justify-center h-28 border-dashed border-2 border-gray-600 hover:border-gray-400 bg-transparent text-gray-400 hover:text-gray-300 rounded-md transition-colors"
            onClick={handlePdfButtonClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-8 w-8 mb-2 text-gray-400 animate-spin" />
            ) : (
              <FileText className="h-8 w-8 mb-2 text-gray-400" />
            )}
            {isLoading ? "Uploading..." : "Upload Tariff PDF"}
            <input
              type="file"
              ref={pdfInputRef}
              className="hidden"
              accept=".pdf"
              onChange={(e) => onPdfUpload(e.target.files[0])}
              disabled={isLoading}
            />
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-red-700/30 text-red-400">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {uploadedFile && !isLoading && !error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-700/30 text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TariffDashboard() {
  const [tariffFile, setTariffFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!tariffFile) {
      setError("Please upload a tariff PDF file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", tariffFile);
    formData.append("output_excel", "output.xlsx");

    try {
      const response = await fetch("http://35.176.85.181:8002/tariff_upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API call failed:", errorText);
        throw new Error(`API call failed: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      console.log("Response content-type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json();
        console.log("Received JSON data:", jsonData);
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `output_tariff.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error during API call:", error.message);
      setError(`An error occurred during analysis: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="flex items-center justify-between py-4 px-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Claims Analysis</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <TariffPdfUploadCard
            title="Upload Hospital Tariff"
            onPdfUpload={(file) => {
              if (file && file.type === "application/pdf") {
                setTariffFile(file);
                setError(null);
              } else {
                setError("Please upload a valid PDF file.");
              }
            }}
            uploadedFile={tariffFile}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2 ${
              isLoading || !tariffFile ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAnalyze}
            disabled={isLoading || !tariffFile}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart2 className="h-5 w-5" />
                Analyze Tariff
              </>
            )}
          </button>
          <button
            className={`bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 border border-gray-600 hover:border-gray-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </main>
    </div>
  );

}








