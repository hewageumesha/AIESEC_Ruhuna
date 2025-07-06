import { useState, useEffect } from 'react';
import React from 'react';


const PhotoSlider = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [fade, setFade] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    
    const timer = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % photos.length);
        setFade(false);
      }, 500); // Match this with CSS transition duration
    }, isMobile ? 4000 : 3000); // Slower transition on mobile

    return () => clearInterval(timer);
  }, [nextIndex, photos?.length, isMobile]);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-75 md:h-100 lg:h-screen bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  // For single photo case
  if (photos.length === 1) {
    return (
      <div 
        className="w-full h-64 md:h-96 lg:h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${photos[0].url})` }}
      />
    );
  }

  return (
    <div className="relative w-full h-64 md:h-96 lg:h-screen overflow-hidden">
      {/* Current image with responsive sizing */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          fade ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          backgroundImage: `url(${photos[currentIndex]?.url})`,
          backgroundPosition: isMobile ? 'center center' : 'center 30%'
        }}
      />
      
      {/* Next image (preloading) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-0"
        style={{ backgroundImage: `url(${photos[nextIndex]?.url})` }}
      />
      
      {/* Mobile-optimized navigation dots */}
      {isMobile && photos.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setCurrentIndex(index);
                setNextIndex((index + 1) % photos.length);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoSlider;