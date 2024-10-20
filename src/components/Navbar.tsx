'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const navItems = [
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Sign In', path: '/auth/sign-in' },
];

interface NavItem {
  name: string;
  path: string;
}

const NavLink = ({ item, isActive, isMobile = false, onClick = () => {} }: { item: NavItem; isActive: boolean; isMobile?: boolean; onClick?: () => void }) => (
  <Link
    href={item.path}
    className={`px-3 py-3 text-lg font-medium transition-all duration-300 ease-in-out ${isActive ? 'text-blue-600' : 'text-black hover:text-blue-600'} relative group ${isMobile ? 'block w-full text-center' : ''}`}
    onClick={onClick}
  >
    {item.name}
    {!isMobile && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
    )}
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDegree, setFlipDegree] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleImageClick = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setFlipDegree(flipDegree + 360);
      setTimeout(() => setIsFlipping(false), 1000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Home">
              <div className="relative">
                <Image
                  id="nav-image"
                  src="/yaadbg.svg"
                  alt="Yaad Logo"
                  width={100}
                  height={40}
                  priority
                  onClick={handleImageClick}
                  style={{
                    transform: `rotateY(${flipDegree}deg)`,
                    transition: 'transform 0.6s ease-in-out',
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.slice(0, 2).map((item) => (
                <NavLink key={item.name} item={item} isActive={pathname === item.path} />
              ))}
              <SignedIn>
                <NavLink item={{ name: 'Yaad', path: '/yaad' }} isActive={pathname === '/yaad'} />
                <UserButton />
              </SignedIn>
              <SignedOut>
                <NavLink item={{ name: 'Sign In', path: '/auth/sign-in' }} isActive={pathname === '/auth/sign-in'} />
              </SignedOut>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 ${isOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg z-50 transform ${isOpen ? 'scale-y-100' : 'scale-y-0'} origin-top transition-transform duration-300 ease-in-out`}
      >
        <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.name}
              item={item}
              isActive={pathname === item.path}
              isMobile={true}
              onClick={() => setIsOpen(false)}
            />
          ))}
          <SignedIn>
            <NavLink
              item={{ name: 'Yaad', path: '/yaad' }}
              isActive={pathname === '/yaad'}
              isMobile={true}
              onClick={() => setIsOpen(false)}
            />
          </SignedIn>
          <SignedOut>
            <NavLink
              item={{ name: 'Sign In', path: '/auth/sign-in' }}
              isActive={pathname === '/auth/sign-in'}
              isMobile={true}
              onClick={() => setIsOpen(false)}
            />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
