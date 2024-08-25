"use client";
import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [responseData, setResponseData] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

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

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== value)
      );
    }
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
          <div className="flex flex-col space-y-2 mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleOptionChange}
                className="form-checkbox"
              />
              <span className="ml-2">Alphabets</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleOptionChange}
                className="form-checkbox"
              />
              <span className="ml-2">Numbers</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="Highest lowercase alphabet"
                onChange={handleOptionChange}
                className="form-checkbox"
              />
              <span className="ml-2">Highest lowercase alphabet</span>
            </label>
          </div>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}
