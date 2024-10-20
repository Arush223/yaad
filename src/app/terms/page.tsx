/* eslint-disable react/no-unescaped-entities */
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from 'next/image';

const TermsOfUse: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: 'url(/paper.png)' }}
    >
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="bg-white rounded-xl p-8 max-w-3xl w-full shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-black">
            Terms of Use
          </h1>
          <p className="mb-4 font-semibold"> Effective: {new Date().getMonth()+1}/{new Date().getFullYear()} </p>
          <p className="text-gray-700 mb-4">
            Welcome to Yaad! By using our service, you agree to the
            following terms and conditions. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-black">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            By accessing or using Yaad, you agree to be bound by these
            Terms of Use and our Privacy Policy. If you do not agree with any
            part of these terms, please do not use our service.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-black">
            2. Use of Service
          </h2>
          <p className="text-gray-700 mb-4">
            Yaad is an AI-powered platform designed for preserving your living memory. 
            You agree to use the service in compliance with all
            applicable laws and regulations. You must not:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Use the service for any illegal activities.</li>
            <li>Interfere with the security or functionality of the service.</li>
            <li>Attempt to access data that you are not authorized to access.</li>
          </ul>
          <h2 className="text-xl font-semibold mb-2 text-black">
            3. User Accounts
          </h2>
          <p className="text-gray-700 mb-4">
            When you create an account, you agree to provide accurate
            information and keep your login credentials secure. You are
            responsible for all activities conducted through your account.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-black">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            Yaad is a hackathon project and is provided on an "as is"
            basis. We do not make any warranties regarding the accuracy,
            reliability, or availability of the service. You use the service at
            your own risk.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-black">
            5. Changes to the Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We may update these terms from time to time. The updated version
            will be posted on this page, and your continued use of the service
            after any changes means you accept the new terms.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-black">
            6. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about these terms, feel free
            to contact us at <a href="/contact" className="text-blue-700 underline">our contact page</a>.
          </p>
        </div>
      </div>
      <Footer className="text-white bg-black"/>
    </div>
  );
};

export default TermsOfUse;