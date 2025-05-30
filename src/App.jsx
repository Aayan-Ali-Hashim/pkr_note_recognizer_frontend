import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setPrediction('');
  };

  const handlePrediction = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true); // ✅ Start loader

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://pkr-note-recognizer.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction+" PKR");
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error making prediction");
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <div className='scrollbar-hide overflow-y-hidden h-screen w-screen'>
      <div className='bg-gradient-to-r from-black via-red-900 to-black text-white text-center p-4 shadow-md font-bold text-2xl'>
        PKR Note Recognizer
      </div>

      <div className="container mx-auto bg-[url('/src/assets/5630939.jpg')] bg-linear-to-bl p-4 min-h-screen flex items-center justify-center">
        <div className="text-center text-white inline">

          <p>Upload your Image</p>

          <input
            type="file"
            id="files"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="files"
            className="block bg-red-500 mt-3 px-8 py-2 text-white rounded-full hover:bg-red-600 cursor-pointer"
          >
            Choose File
          </label>

          {previewURL && (
            <img
              src={previewURL}
              alt="Uploaded Preview"
              className="mx-auto mt-4 border rounded max-h-64"
            />
          )}

          <button
            onClick={handlePrediction}
            disabled={!selectedFile || loading}
            className={`mt-4 px-4 py-2 text-white rounded-full ${
              selectedFile && !loading
                ? 'bg-red-800 hover:bg-green-800 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>

          {/* ✅ Loader Spinner */}
          {loading && (
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && prediction && (
            <p className="mt-4 text-lg text-red-400 font-bold text-center animate-bounce animate-infinite animate-duration-1000 animate-ease-in animate-normal ">
              Currency Note : {prediction}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
