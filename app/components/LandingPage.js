"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Zap,
  Award,
  BarChart2,
  Users,
} from "lucide-react";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    weight: "",
    height: "",
    goal: "",
  });
  const [fitnessRegimen, setFitnessRegimen] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (showForm) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "emails"), {
        email,
        timestamp: new Date(),
      });
      setShowForm(true);
    } catch (error) {
      console.error("Error adding email: ", error);
      alert("Failed to submit email. Please try again later.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        ...formData,
        email,
        timestamp: new Date(),
      });

      setFitnessRegimen(["Generating your personalized fitness regimen..."]);

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            // "HTTP-Referer": `${process.env.NEXT_PUBLIC_APP_URL}`, // Your website URL
            "X-Title": "Fitness Regimen Generator", // Optional, for OpenRouter's analytics
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo", // You can change this to other available models
            messages: [
              {
                role: "system",
                content: "You are a personal fitness training assistant",
              },
              {
                role: "user",
                content: `Generate a personalized fitness regimen for me with the following details: Age: ${formData.age}, Sex: ${formData.sex}, Weight: ${formData.weight}, Height: ${formData.height}, Fitness Goal: ${formData.goal}.`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text =
        data.choices[0]?.message.content.trim() || "No regimen found.";
      const generatedRegimens = text
        .split("\n")
        .filter((regimen) => regimen.trim().length > 0);
      setFitnessRegimen(generatedRegimens);
    } catch (error) {
      console.error("Error generating fitness regimen: ", error);
      setFitnessRegimen([
        "Failed to generate fitness regimen. Please try again later.",
      ]);
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
            className="bg-green-600 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-green-700 transition duration-300 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(true);
            }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Zap size={60} className="mx-auto text-green-600" />
              <h3 className="text-xl font-bold mt-4">AI-Powered Workouts</h3>
              <p className="mt-2 text-gray-400">
                Get personalized workout plans powered by AI.
              </p>
            </div>
            <div className="text-center">
              <Award size={60} className="mx-auto text-green-600" />
              <h3 className="text-xl font-bold mt-4">NFT Integration</h3>
              <p className="mt-2 text-gray-400">
                Unlock unique NFTs as you progress in your fitness journey.
              </p>
            </div>
            <div className="text-center">
              <BarChart2 size={60} className="mx-auto text-green-600" />
              <h3 className="text-xl font-bold mt-4">Analytics Dashboard</h3>
              <p className="mt-2 text-gray-400">
                Track your performance with advanced analytics.
              </p>
            </div>
            <div className="text-center">
              <Users size={60} className="mx-auto text-green-600" />
              <h3 className="text-xl font-bold mt-4">Community Support</h3>
              <p className="mt-2 text-gray-400">
                Join a community of like-minded fitness enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form for Collecting User Details */}
      {showForm && (
        <section
          ref={formRef}
          className="py-20 bg-gradient-to-b from-purple-900 to-black"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-6xl font-bold mb-6 text-center">
              Provide Your Details
            </h2>
            <form
              onSubmit={handleFormSubmit}
              className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg"
            >
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Sex</label>
                <input
                  type="text"
                  name="sex"
                  value={formData.sex}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Fitness Goal</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:bg-green-700 transition duration-300 w-full"
              >
                Generate Regimen
              </button>
            </form>
            {fitnessRegimen && (
              <div className="mt-10 bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Your Regimen:</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {fitnessRegimen.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
