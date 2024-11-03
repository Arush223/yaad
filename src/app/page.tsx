/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SignedIn, SignedOut } from '@clerk/nextjs';

const TypewriterText: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({ text, delay = 100, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prevText) => prevText + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, delay, onComplete]);

  return (
    <span className="typewriter">
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
};

const Page: React.FC = () => {
  const router = useRouter();
  const [showGetStarted, setShowGetStarted] = useState(false);

  const handleTitleComplete = () => {
    setShowGetStarted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow relative">
        <Image
          src="/paper.png"
          alt="Paper Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
        <div className="absolute inset-0 flex flex-col">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          <TypewriterText text="Welcome to Yaad" onComplete={handleTitleComplete} />
        </h1>
        {showGetStarted && (
          <div className="mt-2 mb-4 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-blue-600">
            <TypewriterText text="Get Started" delay={150} />
          </div>
        )}
        <div className="relative transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer mt-4">
          <SignedIn>
            <div onClick={() => router.push('/yaad')} className="relative group">
          <Image
            src="/typewriter.svg"
            alt="Typewriter"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg ">Go to Yaad</span>
          </div>
            </div>
          </SignedIn>
          <SignedOut>
            <div onClick={() => router.push('/auth/sign-up')} className="relative group">
          <Image
            src="/typewriter.svg"
            alt="Typewriter"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg">Sign Up</span>
          </div>
            </div>
          </SignedOut>
        </div>
          </div>
        </div>
      </div>
      <Footer className='text-white bg-black'/>
    </div>
  );
};

export default Page;
