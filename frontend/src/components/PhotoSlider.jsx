import { useState, useEffect } from 'react';

const PhotoSlider = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!photos || photos.length === 0) return;
    
    const timer = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % photos.length);
        setFade(false);
      }, 500); // Half of transition duration
    }, 3000);

    return () => clearInterval(timer);
  }, [nextIndex, photos?.length || 0]);

  if (!photos || photos.length === 0) {
    return <div className="w-full h-screen bg-gray-200"></div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Current image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-85'}`}
        style={{ backgroundImage: `url(${photos[currentIndex]?.url || ''})` }}
      />
      
      {/* Next image (preloading) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-0"
        style={{ backgroundImage: `url(${photos[nextIndex]?.url || ''})` }}
      />
    </div>
  );
};

export default PhotoSlider;