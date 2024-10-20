import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Page: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow relative">
        <Image
          src="/paper.png"
          alt="Paper Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            {/* Add your main content here */}
            <h1 className="text-4xl font-bold text-white">Welcome to Our Site</h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;