import React, { useState, useEffect, useRef } from 'react';
import getRandomOutput from './utils/getRandomOutput';

import Message from './components/message';

function App() {
    const [movieName, setMovieName] = useState('');
    const [randomAns, setRandomAns] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [disableInput, setDisableInput] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (!savedMode) {
            localStorage.setItem('darkMode', JSON.stringify(true));
        }
        return savedMode ? JSON.parse(savedMode) : true;
    });

    const [movieData, setMovieData] = useState('');
    const inputRefs = useRef([]);
    
    useEffect(() => {
        fetchMovie();
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (inputRefs.current[currentIndex]) {
            inputRefs.current[currentIndex].focus();
        }
    }, [currentIndex]);

    const fetchMovie = async () => {
        try {
            const response = await fetch('https://moviedata.alwaysdata.net/movie');
            if (!response.ok) {
                throw new Error('Failed to fetch movie');
            }
            const data = await response.json();
            setMovieData(data);
            const randomMovie = data.Movie.toUpperCase();
            setMovieName(randomMovie);
            const randomizedOutput = getRandomOutput(randomMovie).split('');
            setRandomAns(randomizedOutput);
            setUserAnswer(randomizedOutput);
            setShowAnswer(false);
            setDisableInput(false);
            setIsLoading(false);
            setMessage('');
        } catch (error) {
            console.error('Error fetching movie:', error.message);
            setIsLoading(false);
        }
    };

    const handleChange = (index, event) => {
        if (!disableInput) {
            const value = event.target.value.toUpperCase();
            const newUserAnswer = [...userAnswer];
            newUserAnswer[index] = value;
            setUserAnswer(newUserAnswer);

            if (index < movieName.length - 1) {
                setCurrentIndex(index + 1);
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0) {
            setCurrentIndex(index - 1);
        }
    };

    const checkAnswer = () => {
        if (!disableInput) {
            let userAnswerString = userAnswer.join('').replace(/•/g, ' ');
            if (userAnswerString === movieName) {
                setMessage('Congratulations! Your answer is correct.');
                setDisableInput(true);
            } else {
                setMessage('Sorry! Your answer is incorrect. Please try again.');
            }
        }
    };

    const handleFocus = (index) => {
        inputRefs.current[index].select();
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
        setDisableInput(true);
    };

    const handleReset = () => {
        setUserAnswer(randomAns);
        setMessage('');
    };

    const letterReveal = () => {
        if (!disableInput) {
          const newUserAnswer = [...userAnswer];
          let count = 0;
          while (newUserAnswer[count] === movieName[count]) {
            if (count === movieName.length - 1 && movieName[count] !== ' ') {
              setMessage('Correct Answer!');
              setDisableInput(true);
              break;
            } else {
              count++;
            }
          }
          newUserAnswer[count] = movieName[count];
          setUserAnswer(newUserAnswer);
          setMessage('Letter Revealed!');
        } else {
          setMessage('Input has Disabled!');
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const revealHint = () => {
      let hintMessage = '';
      
      if (movieData.Description && movieData.Description.length > 0) {
          const randomDescriptionIndex = Math.floor(Math.random() * movieData.Description.length);
          hintMessage += `Description: ${movieData.Description[randomDescriptionIndex]}. \n`;
      }

      if (movieData.Cast && movieData.Cast.length > 0) {
          const {Cast} = movieData;
          const selectedCast = Cast.slice(0, 3).join(', ');
          hintMessage += `Cast: ${selectedCast}.`;
      }
      setMessage(hintMessage);
  };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : ''}`} style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000', padding: '20px' }}>
          <h1 className={`text-center font-size-400 mb-4 ${darkMode ? 'text-white' : ''}`}>Guess the movie!!</h1>
          {isLoading ? (
            <div className="loading-skeleton">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="loading-box" />
              ))}
            </div>
          ) : (
            <div className="px-4">
              {movieName && userAnswer.length > 0 && (
                <div className="flex flex-wrap justify-center mb-4">
                  {userAnswer.map((char, index) => (
                    <input
                      key={index}
                      className="m-2 border h-10 w-10 text-center text-black form-control rounded"
                      type="text"
                      maxLength={1}
                      value={showAnswer ? movieName[index] : char}
                      onChange={(event) => handleChange(index, event)}
                      onFocus={() => handleFocus(index)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={{ width: '30px', marginRight: '5px', textAlign: 'center' }}
                      disabled={disableInput}
                    />
                  ))}
                </div>
              )}
              <div className="buttons flex justify-center space-x-4">
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={fetchMovie}>
    Next Movie
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={handleReset} disabled={disableInput}>
    Reset
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={checkAnswer} disabled={disableInput}>
    Check Answer
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={handleShowAnswer}>
    Show Answer
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={letterReveal}>
    Reveal Letter
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={revealHint}>
    Hint
  </button>
  <button className={`border ${darkMode ? 'border-white' : 'border-gray-400'} bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300`} onClick={toggleDarkMode}>
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>

              </div>
              {message && <Message message={message} />}
            </div>
          )}
        </div>
      );
}

export default App;
