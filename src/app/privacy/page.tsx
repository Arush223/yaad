import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'; // For animations

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/paper.png')" }}
    >
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
          
          <p className="mb-4"><strong>Effective Date:</strong> October 2024</p>
          <p className="mb-6">At Yaad, we respect your privacy and are committed to protecting the personal information you provide to us. This privacy policy outlines how we collect, use, and safeguard your data when you interact with our application.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <ul className="list-disc list-inside mb-6">
            <li><strong>Personal Information:</strong> When you sign up or contact us, we may collect your name and email address.</li>
            <li><strong>Usage Data:</strong> We may collect anonymous usage data, such as your interaction with the app, pages viewed, and time spent on the platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6">
            <li>Provide and improve our service.</li>
            <li>Respond to inquiries and support requests.</li>
            <li>Monitor app usage to improve user experience.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p className="mb-6">We take reasonable steps to protect your data and ensure its confidentiality. However, no system is completely secure, and we cannot guarantee the absolute security of your data.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact Us</h2>
          <p className="mb-6">If you have any questions or concerns about these terms, feel free to contact us at our <a href="/contact" className="text-blue-700 underline"/>contact page.</p>

          <p className="mt-8 text-sm text-gray-600">This privacy policy may be updated from time to time, and we encourage you to review it periodically.</p>
        </div>
      </main>

      <Footer className = "text-white bg-black"/>
    </div>
  )
}

export default PrivacyPolicyPage
