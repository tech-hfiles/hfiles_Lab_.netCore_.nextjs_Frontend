"use client";
import React, { useEffect } from 'react';
import Home from '../components/Home';
import confetti from 'canvas-confetti';

const ThankYouPage = () => {
  useEffect(() => {
    const duration = 15 * 1000; 
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    return () => clearInterval(interval);
  }, []); 

  return (
    <Home>
      <div className="w-full h-[calc(100vh-112px)] flex flex-col items-center justify-center " style={{
        background: 'linear-gradient(to bottom, white 70%, #67e8f9 100%)'
      }}>
        <div className="bg-white rounded-lg border shadow-lg  max-w-xl w-full text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 mt-3">
            Thank You for Registering!
          </h1>

          <div className="mb-6 animate-scale-up">
            <img src="/85e294ef76fe7d3df00bfe9ed9d8335ff4b1bdde.png" alt='logo' className="w-20 h-20 mx-auto drop-shadow-lg" />
          </div>



          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="text-blue-800">Welcome</span> to the Future of Lab Management
            </h2>
            <div className="border w-32 mx-auto mt-2"></div>
          </div>



          <p className="text-black leading-relaxed mb-6">
            Our team will connect with you shortly to complete your onboarding process.
          </p>

          <div className='border border-gray-300 mb-2'> </div>

          <p className="text-black  mb-8">
            Get a glimpse of your smarter lab journey
          </p>

          <button
            className="primary text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 mb-3"
            onClick={() => window.location.href = '/'}
          >
            Let's Go
          </button>
        </div>
      </div>

    </Home>
  );
};

export default ThankYouPage;