/* eslint-disable react/no-unescaped-entities */
import Navbar from "@/components/Navbar";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 flex flex-col justify-center">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-blue-200">
          <h1 className="text-3xl font-semibold text-center mb-6 text-blue-700">
            Terms of Use
          </h1>
          <p className="mb-4">Effective Date: October 2024</p>
          <p className="text-gray-700 mb-4">
            Welcome to Yaad! By using our service, you agree to the
            following terms and conditions. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            By accessing or using Classify.ai, you agree to be bound by these
            Terms of Use and our Privacy Policy. If you do not agree with any
            part of these terms, please do not use our service.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            2. Use of Service
          </h2>
          <p className="text-gray-700 mb-4">
            Classify.ai is an AI-powered platform designed for document
            classification. You agree to use the service in compliance with all
            applicable laws and regulations. You must not:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Use the service for any illegal activities.</li>
            <li>Interfere with the security or functionality of the service.</li>
            <li>Attempt to access data that you are not authorized to access.</li>
          </ul>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            3. User Accounts
          </h2>
          <p className="text-gray-700 mb-4">
            When you create an account, you agree to provide accurate
            information and keep your login credentials secure. You are
            responsible for all activities conducted through your account.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            Classify.ai is a hackathon project and is provided on an "as is"
            basis. We do not make any warranties regarding the accuracy,
            reliability, or availability of the service. You use the service at
            your own risk.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            5. Changes to the Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We may update these terms from time to time. The updated version
            will be posted on this page, and your continued use of the service
            after any changes means you accept the new terms.
          </p>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            6. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about these terms, feel free
            to contact us at <a href="/contact" className="text-blue-700 underline">our contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;