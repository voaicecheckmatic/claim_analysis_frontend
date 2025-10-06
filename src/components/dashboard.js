import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart2,
  RotateCcw,
  ChevronDown,
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
} from "lucide-react"

// FileUploadCard component
function FileUploadCard({ title, onPdfUpload, onExcelUpload, uploadedFile }) {
  const pdfInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const handlePdfButtonClick = () => pdfInputRef.current.click();
  const handleExcelButtonClick = () => excelInputRef.current.click();

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
      <div className="flex flex-row items-center gap-2 p-4 border-b border-gray-700">
        <Upload className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            className="flex flex-col items-center justify-center h-28 border-dashed border-2 border-gray-600 hover:border-gray-400 bg-transparent text-gray-400 hover:text-gray-300 rounded-md transition-colors"
            onClick={handlePdfButtonClick}
          >
            <FileText className="h-8 w-8 mb-2 text-gray-400" />
            Upload PDF
            <input
              type="file"
              ref={pdfInputRef}
              className="hidden"
              accept=".pdf"
              onChange={(e) => onPdfUpload(e.target.files[0])}
            />
          </button>
          <button
            className="flex flex-col items-center justify-center h-28 border-dashed border-2 border-gray-600 hover:border-gray-400 bg-transparent text-gray-400 hover:text-gray-300 rounded-md transition-colors"
            onClick={handleExcelButtonClick}
          >
            <FileSpreadsheet className="h-8 w-8 mb-2 text-gray-400" />
            Upload Excel
            <input
              type="file"
              ref={excelInputRef}
              className="hidden"
              accept=".xls,.xlsx"
              onChange={(e) => onExcelUpload(e.target.files[0])}
            />
          </button>
        </div>
        {uploadedFile && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-700/30 text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// TariffAnalysisTable component
function TariffAnalysisTable({ data, activeTab }) {
  console.log("Table data for", activeTab, ":", data); // Debug log
  const columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
  })) : [];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Match":
        return "bg-green-600 text-white";
      case "Mismatch":
        return "bg-red-600 text-white";
      case "Repetitions":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-600 text-white"; // Default for null or unexpected values
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase break-words"
                style={{ minWidth: "100px", maxWidth: "200px" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-400"
              >
                No {activeTab} data available.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-800">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-4 text-sm text-gray-300 break-words"
                    style={{ minWidth: "100px", maxWidth: "200px" }}
                  >
                    {col.key === "match_status" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          activeTab === "repetitions" ? "Repetitions" : row[col.key] || "Unknown"
                        )}`}
                      >
                        {activeTab === "repetitions" ? "Repetitions" : row[col.key] || "-"}
                      </span>
                    ) : (
                      row[col.key] !== null && row[col.key] !== undefined
                        ? row[col.key].toString()
                        : "-"
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ClaimsDashboard() {
  const [hospitalBillFile, setHospitalBillFile] = useState(null);
  const [hospitalTariffFile, setHospitalTariffFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({
    matched: [],
    mismatched: [],
    repetitions: [],
    summary: "",
    savings: null, // Initialize savings in state
  });
  const [activeTab, setActiveTab] = useState("matched");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState("holyspirit");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!hospitalBillFile || !hospitalTariffFile) {
      alert("Please upload both Hospital Bill and Hospital Tariff files.");
      return;
    }

    console.log("Selected hospital:", selectedHospital);
    console.log("Uploading files:", hospitalBillFile.name, hospitalTariffFile.name);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", hospitalBillFile);
    formData.append("hospital", selectedHospital);
    formData.append("output_excel", "output.xlsx");

    try {
      const response = await fetch("http://localhost:5000/v2/claim_automation", {
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
        console.log("Received JSON data - Matched:", jsonData.matched);
        console.log("Received JSON data - Mismatched:", jsonData.mismatched);
        setAnalysisResults({
          matched: jsonData.matched || [],
          mismatched: jsonData.mismatched || [],
          repetitions: jsonData.duplicate || [],
          summary: jsonData.summary || "",
          savings: jsonData.savings !== undefined ? jsonData.savings : null, // Store savings from response
        });
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `output_${selectedHospital}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setAnalysisResults({
          matched: [],
          mismatched: [],
          repetitions: [],
          summary: "",
          savings: null,
        });
      }
    } catch (error) {
      console.error("Error during API call:", error.message);
      alert(`An error occurred during analysis: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  // Function to convert the summary text with markdown-like formatting to HTML
  const formatSummary = (summary) => {
    if (!summary) return null;

    // Split the summary into lines
    const lines = summary.split("\n");
    let formatted = [];
    let currentSection = null;

    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return;

      // Handle section headers (e.g., *Doctor Role Summary*, *Test Billing Patterns*, *Conclusion*)
      if (line.startsWith("*") && line.endsWith("*")) {
        currentSection = line.replace(/\*/g, "").trim();
        formatted.push(
          <h3 key={`section-${index}`} className="text-lg font-semibold text-white mt-4">
            {currentSection}
          </h3>
        );
      } else if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
        // Handle numbered list items
        const [number, content] = line.split(". ");
        formatted.push(
          <div key={`item-${index}`} className="ml-4 mt-2">
            <span className="font-semibold">{number}. </span>
            {content.replace(/\*/g, "").trim()}
          </div>
        );
      } else if (line.startsWith("- ")) {
        // Handle bullet points
        const content = line.replace("- ", "").replace(/\*/g, "").trim();
        formatted.push(
          <div key={`bullet-${index}`} className="ml-8">
            • {content}
          </div>
        );
      } else {
        // Handle regular paragraphs
        formatted.push(
          <p key={`para-${index}`} className="mt-2 text-gray-300">
            {line.replace(/\*/g, "").trim()}
          </p>
        );
      }
    });

    return formatted;
  };
   const navigate = useNavigate()

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
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white bg-transparent hover:bg-gray-700 rounded-md transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm">{selectedHospital}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    setSelectedHospital("holyspirit");
                    setIsDropdownOpen(false);
                  }}
                >
                  holyspirit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    setSelectedHospital("manipal");
                    setIsDropdownOpen(false);
                  }}
                >
                  manipal
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => {
                    setSelectedHospital("noble");
                    setIsDropdownOpen(false);
                  }}
                >
                  noble
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileUploadCard
            title="Upload Hospital Bill"
            onPdfUpload={(file) => setHospitalBillFile(file)}
            onExcelUpload={(file) => setHospitalBillFile(file)}
            uploadedFile={hospitalBillFile}
          />
          <FileUploadCard
            title="Upload Hospital Tariff"
            onPdfUpload={(file) => setHospitalTariffFile(file)}
            onExcelUpload={(file) => setHospitalTariffFile(file)}
            uploadedFile={hospitalTariffFile}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2 ${
              isLoading || !hospitalBillFile || !hospitalTariffFile ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAnalyze}
            disabled={isLoading || !hospitalBillFile || !hospitalTariffFile}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart2 className="h-5 w-5" />
                Analyze Tariffs
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
          <button
            className={`bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 border border-gray-600 hover:border-gray-500`}
            onClick={() => navigate("/test_page")}
            disabled={isLoading}
          >
            Tariff Automation
          </button>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-sm p-6">
          <div className="pb-4">
            <h2 className="text-2xl font-semibold text-white">Tariff Analysis Results</h2>
          </div>
          <div>
            <div className="w-full">
              <div className="grid grid-cols-3 bg-gray-800 p-1 rounded-lg border border-gray-700">
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === "matched"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("matched")}
                >
                  Matched ({analysisResults.matched.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === "mismatched"
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("mismatched")}
                >
                  Mismatched ({analysisResults.mismatched.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === "repetitions"
                      ? "bg-gray-600 text-white"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("repetitions")}
                >
                  Repetitions ({analysisResults.repetitions.length})
                </button>
              </div>
              <div className="mt-6">
                {activeTab === "matched" && (
                  <TariffAnalysisTable data={analysisResults.matched} activeTab="matched" />
                )}
                {activeTab === "mismatched" && (
                  <TariffAnalysisTable data={analysisResults.mismatched} activeTab="mismatched" />
                )}
                {activeTab === "repetitions" && (
                  <TariffAnalysisTable data={analysisResults.repetitions} activeTab="repetitions" />
                )}
                {/* Savings Card for all hospitals */}
                {analysisResults.savings !== null ? (
                  <div className="mt-6 p-4 bg-blue-700/30 rounded-md">
                    <h2 className="text-xl font-semibold text-white mb-2">Savings Summary</h2>
                    <p className="text-gray-300">
                      Hospital has overcharged by <span className="font-bold text-orange-500">₹ {analysisResults.savings.toFixed(2)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-gray-700/30 rounded-md">
                    <h2 className="text-xl font-semibold text-white mb-2">Savings Summary</h2>
                    <p className="text-gray-300">
                      -
                    </p>
                  </div>
                )}
                {/* Render the summary only for holyspirit hospital and if summary exists */}
                {selectedHospital === "holyspirit" && analysisResults.summary && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-md">
                    <h2 className="text-xl font-semibold text-white mb-2">Analysis Summary</h2>
                    <div className="text-gray-300">{formatSummary(analysisResults.summary)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}