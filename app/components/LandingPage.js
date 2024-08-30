// app/components/LandingPage.js
"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Zap,
  Award,
  BarChart2,
  Users,
} from "lucide-react"; // Import all needed icons
import { db } from "../Firebase"; // Import the db from firebase.js
import { collection, addDoc } from "firebase/firestore";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the email to the "emails" collection in Firestore
      await addDoc(collection(db, "emails"), {
        email: email,
        timestamp: new Date(),
      });
      alert("Thank you for joining! We have received your email.");
      setEmail(""); // Clear the input field
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit email. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-20 text-center">
          <motion.h1
            className="text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Fitness Reimagined
          </motion.h1>
          <motion.p
            className="text-3xl mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            AI • NFTs • Analytics • Community
          </motion.p>
          <motion.button
            className="bg-purple-600 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-purple-700 transition duration-300 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Revolution <ArrowRight className="ml-2" />
          </motion.button>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={40} />
        </motion.div>
      </header>

      {/* Interactive 3D Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">
            Experience the Future
          </h2>
          <InteractiveFeatures />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-2xl mb-10">
            Join our exclusive waitlist and be the first to experience the
            future of fitness
          </p>
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto flex flex-col sm:flex-row items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-2/3 px-6 py-4 rounded-full text-gray-900 mb-4 sm:mb-0 sm:mr-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg"
              required
            />
            <motion.button
              type="submit"
              className="w-full sm:w-auto bg-purple-600 text-white font-bold py-4 px-10 rounded-full hover:bg-purple-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Your Fitness App. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const InteractiveFeatures = () => {
  const features = [
    {
      icon: <Zap size={40} />,
      title: "AI Chatbot",
      description: "24/7 personalized workout advice",
    },
    {
      icon: <Award size={40} />,
      title: "NFT Rewards",
      description: "Earn unique digital assets",
    },
    {
      icon: <BarChart2 size={40} />,
      title: "Analytics",
      description: "Visualize your progress in real-time",
    },
    {
      icon: <Users size={40} />,
      title: "Community",
      description: "Connect with fitness enthusiasts",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  );
};

const FeatureCard = ({ feature }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [30, -30]);
  const rotateY = useTransform(x, [-300, 300], [-30, 30]);

  const handleMouseMove = (event) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative h-96 rounded-2xl overflow-hidden cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl"
        style={{ z: -1 }}
        animate={{ scale: hovered ? 1.05 : 1 }}
      />
      <motion.div
        className="absolute inset-1 bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
        style={{ z: 1, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="text-purple-400 mb-6"
          style={{ z: 50 }}
          animate={{ rotateY: hovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>
        <motion.h3
          className="text-3xl font-semibold mb-4"
          style={{ z: 30 }}
          animate={{ y: hovered ? -10 : 0 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className="text-gray-300"
          style={{ z: 20 }}
          animate={{ opacity: hovered ? 1 : 0.8 }}
        >
          {feature.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
