/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  linkedinUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Aarush Jagtap',
    role: 'Full Stack Developer',
    imageUrl: '/aarush.png',
    bio: "Brief biography of Team Member 1. Describe their background, expertise, and role in Yaad.",
    linkedinUrl: 'https://www.linkedin.com/in/aarushj/',
  },
  {
    name: 'Pranav Singh',
    role: 'Back-End Developer',
    imageUrl: '/pranav.png',
    bio: "Brief biography of Team Member 2. Highlight their technical skills and contributions to Yaad's development.",
    linkedinUrl: 'https://www.linkedin.com/in/pranav-singh-usa/',
  },
  {
    name: 'Siddhant Bhardwaj',
    role: 'UI/UX Designer',
    imageUrl: '/siddhant.png',
    bio: "Brief biography of Team Member 3. Emphasize their design philosophy and how it shapes Yaad's user experience.",
    linkedinUrl: 'https://www.linkedin.com/in/siddhantbh1/',
  },
];

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-center">Meet Team Yaad</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-48 h-48 mb-4 relative">
                <Image 
                  src={member.imageUrl} 
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <p className="text-center mb-4">{member.bio}</p>

              {/* LinkedIn Icon */}
              <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-2">
                <Image 
                  src="/linkedin.svg"  // Make sure this path points to a valid LinkedIn icon
                  alt="LinkedIn Icon" 
                  width={24} 
                  height={24} 
                  className="hover:opacity-75 transition-opacity duration-200"
                />
              </Link>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-center max-w-2xl mx-auto">
            At Yaad, we're committed to preserving cherished memories and improving the lives of individuals affected by cognitive decline. Our team combines expertise in technology, design, and healthcare to create innovative solutions that foster connection and joy.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
