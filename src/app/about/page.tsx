/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Image 
          src="/paper.png"
          alt="Paper Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-20 flex flex-col items-center justify-center relative z-10">
        <div className="max-w-2xl  mx-auto bg-white p-8 rounded-2xl shadow-md text-center space-y-12">
          <h1 className="text-4xl font-bold mb-8">About Yaad</h1>

          <section>
            <p className="text-lg mb-6">
              Yaad is an innovative web application designed to preserve and revisit
              the cherished memories of individuals, particularly those with
              degenerative cognitive conditions like Alzheimer's and dementia.
            </p>
            <p className="text-lg">
              Our app allows users to record, transcribe, and store their memories
              securely while using AI to retrieve specific experiences based on prompts.
              With this unique blend of technology and empathy, Yaad aims to foster
              moments of connection, comfort, and joy through personalized memory recall.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Technologies We Use</h2>
            <ul className="list-none space-y-4">
              <li>
                <span className="font-semibold">Next.js:</span> Our app is built using
                Next.js, a powerful React-based framework that enhances performance
                and enables seamless server-side rendering.
              </li>
              <li>
                <span className="font-semibold">Clerk for Authentication:</span> We use
                Clerk to manage user authentication securely, supporting features like
                passwordless login and multi-factor authentication.
              </li>
              <li>
                <span className="font-semibold">Pinecone for Database and Vector Embeddings:</span> At the core of our memory retrieval system is Pinecone, 
                a high-performance vector database solution. Pinecone allows us to store vector embeddings of recorded memories, 
                enabling our AI to quickly and accurately retrieve related memories based on specific prompts. 
                This advanced search capability makes it easier to find and relive memories that may have faded over time..
              </li>
              <li>
                <span className="font-semibold">Tailwind CSS:</span> We've designed
                the Yaad interface with Tailwind CSS, ensuring a visually appealing
                and accessible user experience.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg">
              At Yaad, we're committed to helping individuals and their loved ones
              maintain connections to their most precious memories. By leveraging
              cutting-edge technology with a compassionate approach, we strive to
              improve the quality of life for those affected by memory loss and
              cognitive decline.
            </p>
          </section>
        </div>
      </div>

      <Footer className="text-white bg-black z-20" />
    </div>
  );
}

export default AboutPage;
