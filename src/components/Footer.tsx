import React from 'react';
import Link from 'next/link';


interface FooterProps {
  className?: string; 
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0  text-black py-2 md:py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Copyright Section */}
          <div className="text-center md:text-left text-sm md:text-base">
            <p>&copy; {new Date().getFullYear()} Yaad. All rights reserved.</p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-4 items-center text-center text-sm">
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
