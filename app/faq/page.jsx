"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";

const faqCategories = [
  {
    name: "Orders & Shipping",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    faqs: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping typically takes 5-7 business days within the US. Express shipping options are available at checkout for faster delivery (2-3 business days). International shipping times vary by location.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with a tracking number. You can also view your order status by logging into your account and visiting the 'My Orders' page.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes! We ship to most countries worldwide. International shipping rates and delivery times are calculated at checkout based on your location.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it. After that, the order enters processing and cannot be changed. Contact our support team immediately if you need assistance.",
      },
    ],
  },
  {
    name: "Returns & Refunds",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
        />
      </svg>
    ),
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Some items like opened earphones may have restrictions for hygiene reasons.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To start a return, log into your account, go to 'My Orders', select the order, and click 'Request Return'. You'll receive a prepaid shipping label via email within 24 hours.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Once we receive and inspect your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 business days depending on your bank.",
      },
      {
        question: "Do you offer exchanges?",
        answer:
          "Yes! If you'd like a different size, color, or product, you can request an exchange during the return process. If there's a price difference, we'll adjust accordingly.",
      },
    ],
  },
  {
    name: "Products",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    faqs: [
      {
        question: "Are all products authentic?",
        answer:
          "Absolutely! We are an authorized retailer and only sell 100% genuine products. Every item comes with manufacturer warranty and authenticity guarantee.",
      },
      {
        question: "What warranty do products have?",
        answer:
          "Most products come with the manufacturer's standard warranty (typically 1-2 years). Some products offer extended warranty options which can be added at checkout.",
      },
      {
        question: "How do I know if a product will work with my setup?",
        answer:
          "Each product page includes detailed specifications and compatibility information. If you're unsure, our support team is happy to help you find the right product for your needs.",
      },
      {
        question: "Do you offer product demos or reviews?",
        answer:
          "Yes! Check our product pages for customer reviews, detailed descriptions, and where available, video demonstrations. We also feature products on our social media channels.",
      },
    ],
  },
  {
    name: "Payment & Security",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Cash on Delivery (COD) for eligible orders.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes! We use industry-standard SSL encryption and partner with trusted payment processors like Stripe. We never store your complete credit card details on our servers.",
      },
      {
        question: "Can I pay in installments?",
        answer:
          "Yes! We offer flexible payment options through our payment partners. Select 'Pay in installments' at checkout to see available plans based on your order total.",
      },
      {
        question: "Why was my payment declined?",
        answer:
          "Common reasons include incorrect card details, insufficient funds, or bank security blocks. Try a different payment method or contact your bank. Our support team can also assist.",
      },
    ],
  },
  {
    name: "Account & Support",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click the user icon in the navigation bar and select 'Sign Up'. You can register with your email or use social login (Google, etc.) for faster access.",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Click 'Sign In', then 'Forgot Password'. Enter your email address and we'll send you a password reset link. Check your spam folder if you don't see it.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          `You can reach us via email at ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}, call us at +1 (424) 397-4074, or use the contact form on our Contact page. We typically respond within 24-48 hours.`,
      },
      {
        question: "Do you have a physical store?",
        answer:
          "Currently, we operate exclusively online, which allows us to offer competitive prices and ship directly to customers worldwide. No physical storefront at this time.",
      },
    ],
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-medium text-gray-900 pr-8">{question}</span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${isOpen ? "rotate-45 bg-[#1877f2] text-white" : "text-gray-500"}`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleFAQClick = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-block px-4 py-1.5 bg-[#1877f2]/20 text-[#1877f2] rounded-full text-sm font-medium mb-6">
              Help Center
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked
              <span className="text-[#1877f2]"> Questions</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find quick answers to common questions about orders, shipping,
              returns, and more.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Categories
                  </h3>
                  {faqCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveCategory(index);
                        setOpenFAQ(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeCategory === index
                          ? "bg-[#1877f2] text-white shadow-md shadow-[#1877f2]/30"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}>
                      <span
                        className={
                          activeCategory === index
                            ? "text-white"
                            : "text-gray-500"
                        }>
                        {category.icon}
                      </span>
                      <span className="font-medium text-sm">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    <span className="w-12 h-12 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
                      {faqCategories[activeCategory].icon}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {faqCategories[activeCategory].name}
                    </h2>
                  </div>

                  <div>
                    {faqCategories[activeCategory].faqs.map((faq, index) => (
                      <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openFAQ === index}
                        onClick={() => handleFAQClick(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white border-t">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-[#1877f2] hover:bg-[#1466d8] text-white font-semibold rounded-lg transition-colors">
                Contact Support
              </Link>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors">
                Email Us Directly
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
