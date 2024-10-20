import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent text-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Yaad. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center text-center">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
