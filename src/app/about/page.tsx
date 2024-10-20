import React from 'react'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar/> 
      <h1 className="text-4xl font-bold mb-6" style={{ textAlign: 'center' }}>About Yaad</h1>

      <section className="mb-8">
        <p className="text-lg mb-4">
          Yaad is an innovative web application designed to preserve and revisit
          the cherished memories of individuals, particularly those with
          degenerative cognitive conditions like Alzheimer's and dementia.
        </p>
        <p className="text-lg mb-4">
          Our app allows users to record, transcribe, and store their memories
          securely while using AI to retrieve specific experiences based on prompts.
          With this unique blend of technology and empathy, Yaad aims to foster
          moments of connection, comfort, and joy through personalized memory recall.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Technologies We Use</h2>
        <ul className="list-disc list-inside space-y-2">
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
            <span className="font-semibold">SingleStore:</span> The core of our
            memory retrieval system is powered by SingleStore, used for both
            database management and vector embeddings.
          </li>
          <li>
            <span className="font-semibold">Tailwind CSS:</span> We've designed
            the Yaad interface with Tailwind CSS, ensuring a visually appealing
            and accessible user experience.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg">
          At Yaad, we're committed to helping individuals and their loved ones
          maintain connections to their most precious memories. By leveraging
          cutting-edge technology with a compassionate approach, we strive to
          improve the quality of life for those affected by memory loss and
          cognitive decline.
        </p>
      </section>
      <Footer/>
    </div>

  );
}

export default AboutPage