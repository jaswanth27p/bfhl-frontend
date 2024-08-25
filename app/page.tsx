"use client";
import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [responseData, setResponseData] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setError("");
      const parsedData = JSON.parse(jsonInput);

      if (!Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format");
      }

      const response = await fetch("https://bfhl-backend-3f0z.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      setResponseData(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option)
        : [...prevSelectedOptions, option]
    );
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    let output: any = {};

    if (selectedOptions.includes("Numbers")) {
      output.numbers = numbers;
    }
    if (selectedOptions.includes("Alphabets")) {
      output.alphabets = alphabets;
    }
    if (selectedOptions.includes("Highest lowercase alphabet")) {
      output.highest_lowercase_alphabet = highest_lowercase_alphabet;
    }

    return (
      <div className="mt-4">
        {output.numbers && (
          <div>
            <strong>Numbers:</strong> {output.numbers.join(", ")}
          </div>
        )}
        {output.alphabets && (
          <div>
            <strong>Alphabets:</strong> {output.alphabets.join(", ")}
          </div>
        )}
        {output.highest_lowercase_alphabet && (
          <div>
            <strong>Highest Lowercase Alphabet:</strong>{" "}
            {output.highest_lowercase_alphabet.join(", ")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BFHL API Frontend</h1>
      <p>Backend hosted in Render. Sometimes, it takes time to get a response.</p>
      <textarea
        rows={10}
        className="w-full p-2 border rounded"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON data, e.g., {"data": ["A","C","z"]}'
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {responseData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Select Data to Display</h2>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
            >
              Select Options
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div
                    className={`cursor-pointer px-4 py-2 text-sm ${selectedOptions.includes("Alphabets")
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                      }`}
                    onClick={() => toggleOption("Alphabets")}
                  >
                    Alphabets
                  </div>
                  <div
                    className={`cursor-pointer px-4 py-2 text-sm ${selectedOptions.includes("Numbers")
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                      }`}
                    onClick={() => toggleOption("Numbers")}
                  >
                    Numbers
                  </div>
                  <div
                    className={`cursor-pointer px-4 py-2 text-sm ${selectedOptions.includes("Highest lowercase alphabet")
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                      }`}
                    onClick={() =>
                      toggleOption("Highest lowercase alphabet")
                    }
                  >
                    Highest lowercase alphabet
                  </div>
                </div>
              </div>
            )}
          </div>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}
