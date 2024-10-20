"use client";
import { useState } from 'react';
import emailjs from 'emailjs-com';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion'; // For animations

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(''); // Clear previous status
    try {
      if (
        !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY ||
        !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
        !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      ) {
        setStatus('Error: Missing email service configuration.');
        setIsSubmitting(false);
        return;
      }

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      if (result.text === 'OK') {
        setStatus('Message sent successfully!');
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch {
      setStatus('Error: Unable to send message.');
    } finally {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-white shadow-xl rounded-xl p-8 relative"
        >
          <h2 className="text-4xl font-bold text-center text-indigo-600 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-500 text-center mb-10">
            We’d love to hear from you! Whether you have a question, feedback, or just want to say hello.
          </p>
          <form onSubmit={sendEmail} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 border rounded-lg h-40 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold transition-transform"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-4 border-white border-dotted rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </form>
          {status && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center mt-4 text-lg ${
                status.includes('successfully') ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
