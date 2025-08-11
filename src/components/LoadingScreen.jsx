import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const fallbackTimeout = useRef(null);

  // Fallback in case video doesn't load or play
  const handleFallback = () => {
    console.log('Using fallback loading screen');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 30); // Adjust timing as needed

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      console.error('Error loading video');
      setError(true);
      handleFallback();
    };

    const updateProgress = () => {
      if (video.duration) {
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);
      }
    };

    const handleVideoEnd = () => {
      console.log('Video ended');
      onComplete();
    };

    // Set a timeout in case the video doesn't load or play
    fallbackTimeout.current = setTimeout(() => {
      if (progress === 0) {
        console.log('Video loading timeout');
        handleError();
      }
    }, 3000);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleError);

    // Try to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(handleError);
    }

    return () => {
      clearTimeout(fallbackTimeout.current);
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleError);
      video.pause();
      video.currentTime = 0;
    };
  }, [onComplete, progress]);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    overflow: 'hidden'
  };

  const progressBarContainer = {
    position: 'absolute',
    bottom: '10%',
    width: '80%',
    maxWidth: '600px',
    height: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 10001
  };

  const progressBar = {
    width: `${progress}%`,
    height: '100%',
    backgroundColor: '#00B4D8',
    transition: 'width 0.1s linear',
    borderRadius: '5px'
  };

  const loadingText = {
    position: 'absolute',
    color: 'white',
    fontSize: '24px',
    zIndex: 10002,
    textAlign: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyle}>
      {!error ? (
        <video 
          ref={videoRef} 
          src="/Pantalla_Carga/Pantalla_Carga_Malvín.mp4" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
          playsInline 
          muted 
          autoPlay
          preload="auto"
        />
      ) : (
        <div style={loadingText}>
          Cargando experiencia...
        </div>
      )}
      <div style={progressBarContainer}>
        <div style={progressBar} />
      </div>
    </div>
  );
};

export default LoadingScreen;
