import React, { useState } from 'react';
import { useRef } from 'react';
import { ImageUp, Eye, Cigarette, Droplets, Flame, Wind } from 'lucide-react'; // Icons for visual appeal, added Leaf, Droplet, Sun, Wind
import responses from './responses';
import './App.css';
import './index.css';



function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [ratingStyle, setRatingStyle] = useState('Normal');
  const [plantScore, setPlantScore] = useState(0); // Overall score
  const [ratingResult, setRatingResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  // New state variables for detailed scores
  const [appearanceScore, setAppearanceScore] = useState(0);
  const [smellScore, setSmellScore] = useState(0);
  const [tasteScore, setTasteScore] = useState(0);
  const [effectScore, setEffectScore] = useState(0);
  const [drynessScore, setDrynessScore] = useState(0);



  // Function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any previous errors
      setPlantScore(0); // Reset scores when new image is loaded
      setRatingResult('');
      setAppearanceScore(0);
      setSmellScore(0);
      setTasteScore(0);
      setEffectScore(0);
      setDrynessScore(0);
    } else {
      setSelectedImage(null);
      setImageUrl('');
    }
  };

  // Helper function to generate a sub-score within +/- 2.5 of the overall score, clamped to 0.0-10.0
  const generateSubScore = (overallScore) => {
    const minBound = Math.max(0.0, overallScore - 2.5);
    const maxBound = Math.min(10.0, overallScore + 2.5);
    const subScore = (Math.random() * (maxBound - minBound) + minBound).toFixed(1);
    return parseFloat(subScore);
  };

  // Function to generate rating based on static responses
  const generateRating = () => {
    if (!selectedImage) {
      setError('Bitte lade zuerst ein Bild hoch.');
      return;
    }

    setLoading(true); // Start loading animation

    // Simulate a delay for the "processing"
    setTimeout(() => {
      // Generate a random overall plant score with one decimal place
      const randomOverallScore = (Math.random() * 10).toFixed(1);
      const overallScore = parseFloat(randomOverallScore);
      setPlantScore(overallScore); // Update state with the new random overall score

      // Generate sub-scores based on the overall score
      setAppearanceScore(generateSubScore(overallScore));
      setSmellScore(generateSubScore(overallScore));
      setTasteScore(generateSubScore(overallScore));
      setEffectScore(generateSubScore(overallScore));
      setDrynessScore(generateSubScore(overallScore));

      let chosenResponse = "Entschuldigung, für diese Bewertung gibt es leider keine passende Beschreibung, bitte versuchen Sie es erneut."; // Default error message

      const scoreIndex = Math.floor(overallScore); // Floor to get integer index 0-9

      // Function to safely get phrases from a style and index, ensuring it's an array of non-empty strings
      const getSafePhrases = (style, index) => {
        const phrases = responses[style]?.[index];
        if (Array.isArray(phrases)) {
          // Filter out any entries that are not non-empty strings
          return phrases.filter(p => typeof p === 'string' && p.length > 0);
        }
        return [];
      };

      let candidatePhrases = [];

      // 1. Try selected style and score index
      candidatePhrases = getSafePhrases(ratingStyle, scoreIndex);

      // 2. If no valid phrases, fallback to Normal style and same score index
      if (candidatePhrases.length === 0) {
        candidatePhrases = getSafePhrases("Normal", scoreIndex);
      }

      // 3. If still no valid phrases, fallback to Normal style and score index 5 (a general default)
      if (candidatePhrases.length === 0) {
        candidatePhrases = getSafePhrases("Normal", 5);
      }

      if (candidatePhrases.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidatePhrases.length);
        // Direct assignment, as getSafePhrases ensures it's a valid string array
        chosenResponse = candidatePhrases[randomIndex];
      }
      // If candidatePhrases is still empty, the initial chosenResponse ("Entschuldigung...") will be used.


      setRatingResult(chosenResponse);
      setError(''); // Clear any errors
      setLoading(false); // End loading animation
    }, 1500); // Simulate 1.5 seconds of loading
  };

  // Function to determine text color based on score
  const getScoreTextColorClass = (score) => {
    if (score >= 0.0 && score <= 2.0) {
      return 'text-red-800'; // Dark red
    } else if (score >= 2.1 && score <= 4.0) {
      return 'text-red-500'; // Light red
    } else if (score >= 4.1 && score <= 6.0) {
      return 'text-yellow-500'; // Yellow
    } else if (score >= 6.1 && score <= 8.0) {
      return 'text-green-500'; // Light green
    } else if (score >= 8.1 && score <= 10.0) {
      return 'text-green-800'; // Dark green
    }
    return 'text-gray-700'; // Default color if somehow out of range
  };

  // Function to determine background color class for the visual scale progress bar
  const getScoreBackgroundColorClass = (score) => {
    if (score >= 0.0 && score <= 2.0) {
      return 'bg-red-800';
    } else if (score >= 2.1 && score <= 4.0) {
      return 'bg-red-500';
    } else if (score >= 4.1 && score <= 6.0) {
      return 'bg-yellow-500';
    } else if (score >= 6.1 && score <= 8.0) {
      return 'bg-green-500';
    } else if (score >= 8.1 && score <= 10.0) {
      return 'bg-green-800';
    }
    return 'bg-gray-400'; // Default
  };

  // Function to determine emoji based on plantScore
  const getScoreEmoji = (score) => {
    if (score >= 0.0 && score <= 0.9) {
      return '💩💩💩'; // Poo emoji for very low score
    } else if (score >= 1.0 && score <= 1.9) {
      return '🥦';
    } else if (score >= 2.0 && score <= 2.9) {
      return '🥦🥦';
    } else if (score >= 3.0 && score <= 3.9) {
      return '🥦🥦🥦';
    } else if (score >= 4.0 && score <= 4.9) {
      return '🥦🥦🥦🥦';
    } else if (score >= 5.0 && score <= 5.9) {
      return '🥦🥦🥦🥦🥦';
    } else if (score >= 6.0 && score <= 6.9) {
      return '🥦🥦🥦🥦🥦🥦';
    } else if (score >= 7.0 && score <= 7.9) {
      return '🥦🥦🥦🥦🥦🥦🥦';
    } else if (score >= 8.0 && score <= 8.9) {
      return '🥦🥦🥦🥦🥦🥦🥦🥦';
    } else if (score >= 9.0 && score <= 10.0) {
      return '🥦🥦🥦🥦🥦🥦🥦🥦🥦'; // 9 Broccolis for almost high scores
    }
    return ''; // Default empty string
  };
  

  // Tailwind CSS classes for consistent styling
  const containerClasses = "min-h-screen bg-gradient-to-br from-green-800 to-green-500 flex flex-col items-center justify-center p-4 font-sans";
  const cardClasses = "bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]";
  const buttonClasses = "mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2";
  const selectClasses = "w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 cursor-pointer text-gray-800"; // Select text explicitly dark for white background

  // Referenzen auto scroll
  const ratingRef = useRef(null);
  const uploadRef = useRef(null);

  const scrollToUpload = () => uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToRating = () => ratingRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Main design rating container
  const DetailScoreDisplay = ({ label, score, icon: Icon }) => (
    <div className="flex items-center space-x-2 mb-2"> {/* Main flex container for label, scale, score */}
      {/* Label part */}
      <span className="font-medium flex items-center space-x-1 text-gray-700">
        {Icon && <Icon size={16} className="text-teal-600" />} {label}:
      </span>
      {/* Visual Scale part */}
      <div className="flex-grow bg-gray-200 rounded-full h-1.5"> {/* flex-grow to take available space */}
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ease-out ${getScoreBackgroundColorClass(score)}`}
          style={{
            width: `${(score / 10) * 100}%`,
          }}
        ></div>
      </div>
      {/* Score part */}
      <span className={`ml-2 font-semibold ${getScoreTextColorClass(score)}`}>{score} / 10</span> {/* ml-2 for spacing */}
    </div>
  );

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
          <img
            src="./images/HeckenCheck-Logo-1000x600.png"
            alt="HeckenCheck Logo"
            className="object-contain cursor-pointer hover:scale-[1.05]"
            onClick={scrollToUpload}
          />
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-6 flex items-center justify-center space-x-3 font-sans">
          <span><br/>Bud oder Blatt? <br/>Cali-Ott oder Straßenschrott?</span>
        </h1>
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-6 flex items-center justify-center space-x-3 font-sans">
          <span>HeckenCheck klärt das!</span>
        </h1>
        {/* App description: text-gray-600 on dark background */}
        <p className="text-center text-gray-600 mb-8 mt-8 font-bold font-sans">
          Sieht aus wie Bud, schmeckt aber nach Blatt? Cali-Quali, OG-Level oder Straßenott mit mehr Stängeln als Wirkung – wir sagen dir, was Sache ist. Hecke zeigen. Bewertung kassieren. HeckenCheck regelt!
        </p>

        {/* Image Upload Section */}
        <div ref={uploadRef} className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:shadow-lg hover:shadow-grey-200 hover:bg-gray-100 transition-colors duration-200">
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Hochgeladene Pflanze" className="max-h-64 object-contain rounded-lg shadow-md mb-4" />
            ) : (
              <ImageUp size={48} className="text-green-600 mb-3" />
            )}
            {/* Upload button text: text-teal-600 on light background */}
            <span className="text-lg font-semibold text-green-700 hover:text-green-500 font-sans">
              {imageUrl ? 'Bild ändern' : 'Bild hochladen'}
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {/* File name text: text-gray-700 on white card */}
          {selectedImage && <p className="text-sm text-gray-600 mt-2 font-sans">{selectedImage.name}</p>}
        </div>

        {/* Rating Style Selection */}
        <div className="mb-6">
          {/* Label for select dropdown: text-gray-600 on dark background */}
          <label htmlFor="rating-style" className="block text-sm font-bold text-gray-600 mb-2 font-sans">
            Bewertungsstil auswählen:
          </label>
          <select
            id="rating-style"
            value={ratingStyle}
            onChange={(e) => setRatingStyle(e.target.value)}
            className={selectClasses}
          >
            <option value="Normal">Normal</option>
            <option value="Diss">Diss</option>
            <option value="Donald Trump">Donald Trump</option>
            <option value="Harald Glööckler">Harald Glööckler</option>
            <option value="Polizei">Polizei</option>
            <option value="Wissenschaftler">Wissenschaftler</option>
            <option value="Kiffer">Kiffer</option>
            <option value="Fritze Merz">Fritze Merz</option>
            <option value="Zoll">Zoll</option>
            <option value="Growexperte">Growexperte</option>
            <option value="Schnorrer">Schnorrer</option>
            <option value="Deine Mutter">Deine Mutter</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {generateRating(); setTimeout(scrollToRating, 1750);}}
          className={buttonClasses}
          disabled={!selectedImage || loading} // Disable button while loading
        >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <img src="./images/Symbol-weiss.png" alt="Symbol Hanfblatt weiss" className="w-5 h-5 mx-1 object-contain" />
            )}
            {loading ? 'Checke die Hecke...' : 'HeckenCheck starten'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center font-sans">
              {error}
            </div>
          )}

          {/* Display of Random Plant Score */}
          {plantScore > 0 && ( // Only show after a score has been generated
            <div ref={ratingRef} className="mt-8 bg-teal-50 p-6 rounded-xl shadow-inner border-t-4 border-teal-400">
              <h2 className="text-2xl font-bold text-teal-800 mb-3 flex items-center space-x-2 font-sans">
                <span>Deine Punkte:</span>
                {/* Numeric overall score with dynamic color */}
                <span className={`ml-2 text-3xl font-extrabold ${getScoreTextColorClass(plantScore)} font-sans`}>
                  {plantScore} / 10
                </span>
              </h2>
              {/* Symbolic representation: Brokkoli or Poo emoji */}
              <div className="text-center text-4xl mb-3">
                {getScoreEmoji(plantScore)}
              </div>
              {/* Visual Scale: Mini-thermometer */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6"> {/* Added mb-6 for spacing */}
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getScoreBackgroundColorClass(plantScore)}`}
                  style={{
                    width: `${(plantScore / 10) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Detailed Scores Section */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-teal-700 flex items-center space-x-2 font-sans mb-4"> {/* Added mb-4 for more spacing */}
                  <span>Details:</span>
                </h3>
                <DetailScoreDisplay label="Aussehen" score={appearanceScore} icon={Eye} />
                <DetailScoreDisplay label="Geruch" score={smellScore} icon={Wind} />
                <DetailScoreDisplay label="Geschmack" score={tasteScore} icon={Cigarette} />
                <DetailScoreDisplay label="Wirkung" score={effectScore} icon={Flame} />
                <DetailScoreDisplay label="Trocknungsgrad" score={drynessScore} icon={Droplets} />
              </div>
            </div>
          )}

          {/* Rating Result Display */}
          {ratingResult && (
            <div className="mt-8 bg-teal-50 p-6 rounded-xl shadow-inner border-t-4 border-teal-400">
              <h2 className="text-2xl font-bold text-teal-800 mb-3 flex items-center space-x-2 font-sans">
                <span>Dein HeckenCheck:</span>
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{ratingResult}</p>
            </div>
          )}
        </div>
      </div>
  );
}

export default App;
