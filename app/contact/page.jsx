"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { SiIndeed, SiLinkedin, SiGithub } from "react-icons/si";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

const CONTACT_EMAIL = "leoduong28@gmail.com";

const contactInfo = [
  {
    icon: <FiMail className="w-6 h-6" />,
    title: "Email",
    value: CONTACT_EMAIL,
    link: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: <FiPhone className="w-6 h-6" />,
    title: "Phone",
    value: "+1 (424) 397-4074",
    link: "tel:+14243974074",
  },
  {
    icon: <FiMapPin className="w-6 h-6" />,
    title: "Location",
    value: "Torrance, CA",
    link: null,
  },
];

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/LeoDuong28",
    icon: <SiGithub className="w-6 h-6" />,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/leo-duong-la/",
    icon: <SiLinkedin className="w-6 h-6" />,
  },
  {
    name: "Indeed",
    url: "https://profile.indeed.com/p/leod-wp087hl",
    icon: <SiIndeed className="w-6 h-6" />,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const subjectLine = `[${subject}] Contact from ${name}`;
    const body = `From: ${name} (${email})\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-block px-4 py-1.5 bg-[#1877f2]/20 text-[#1877f2] rounded-full text-sm font-medium mb-6">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              We'd Love to Hear
              <span className="text-[#1877f2]"> From You</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Have questions about our products? Need help with an order? Or
              just want to say hello? We're here to help!
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Contact Information
                  </h2>
                  <p className="text-gray-600">
                    Reach out to us through any of these channels.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {info.title}
                        </p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-900 font-medium hover:text-[#1877f2] transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-medium">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <p className="text-sm text-gray-500 font-medium mb-4">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-colors"
                        aria-label={social.name}>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiClock className="w-5 h-5 text-[#1877f2]" />
                    Response Time
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond within 24-48 hours during business
                    days. For urgent matters, please call us directly.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all bg-white">
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="product">Product Question</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-[#1877f2] hover:bg-[#1466d8] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                      Send Message
                      <FiArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white border-t">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have More Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Check out our frequently asked questions for quick answers.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 text-[#1877f2] font-semibold hover:underline">
              Visit our FAQ
              <FiArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
