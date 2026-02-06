import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you create an account, place an order, or contact us, we may collect personal information such as your name, email address, phone number, shipping address, and billing information.",
      },
      {
        subtitle: "Payment Information",
        text: "We use secure third-party payment processors (like Stripe) to handle transactions. We do not store your complete credit card information on our servers.",
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, and the time and date of your visit.",
      },
    ],
  },
  {
    id: "information-use",
    title: "How We Use Your Information",
    content: [
      {
        text: "We use the information we collect to:",
        list: [
          "Process and fulfill your orders",
          "Communicate with you about your orders and provide customer support",
          "Send promotional emails and newsletters (with your consent)",
          "Improve our website and services",
          "Detect and prevent fraud",
          "Comply with legal obligations",
        ],
      },
    ],
  },
  {
    id: "information-sharing",
    title: "Information Sharing",
    content: [
      {
        text: "We do not sell your personal information to third parties. We may share your information with:",
        list: [
          "Service providers who assist in operating our business (payment processors, shipping carriers, etc.)",
          "Law enforcement when required by law",
          "Business partners with your consent",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    content: [
      {
        text: "We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.",
      },
      {
        subtitle: "Types of Cookies We Use",
        list: [
          "Essential cookies: Required for basic website functionality",
          "Analytics cookies: Help us understand how visitors interact with our website",
          "Marketing cookies: Used to deliver relevant advertisements",
        ],
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      {
        text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      {
        text: "Depending on your location, you may have the following rights regarding your personal information:",
        list: [
          "Access: Request a copy of your personal data",
          "Correction: Request correction of inaccurate data",
          "Deletion: Request deletion of your data",
          "Portability: Receive your data in a portable format",
          "Opt-out: Unsubscribe from marketing communications",
        ],
      },
      {
        text: "To exercise any of these rights, please contact us using the information provided below.",
      },
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: [
      {
        text: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.",
      },
    ],
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    content: [
      {
        text: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
      },
    ],
  },
  {
    id: "policy-changes",
    title: "Changes to This Policy",
    content: [
      {
        text: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the 'Last Updated' date. We encourage you to review this policy periodically.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      {
        text: "If you have any questions about this Privacy Policy or our data practices, please contact us at:",
        list: [
          `Email: ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
          "Phone: +1 (424) 397-4074",
        ],
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-block px-4 py-1.5 bg-[#1877f2]/20 text-[#1877f2] rounded-full text-sm font-medium mb-6">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We value your privacy. This policy explains how we collect, use,
              and protect your personal information.
            </p>
            <p className="text-sm text-gray-400 mt-6">
              Last Updated: January 2026
            </p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 mb-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Table of Contents
              </h2>
              <nav className="grid sm:grid-cols-2 gap-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-gray-600 hover:text-[#1877f2] transition-colors text-sm py-1">
                    {index + 1}. {section.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="space-y-4 pl-11">
                    {section.content.map((item, i) => (
                      <div key={i}>
                        {item.subtitle && (
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {item.subtitle}
                          </h3>
                        )}
                        {item.text && (
                          <p className="text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        )}
                        {item.list && (
                          <ul className="mt-3 space-y-2">
                            {item.list.map((listItem, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-gray-600">
                                <svg
                                  className="w-5 h-5 text-[#1877f2] flex-shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {listItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-4">Related Pages</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-[#1877f2] hover:text-[#1877f2] transition-colors text-sm font-medium">
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-[#1877f2] hover:text-[#1877f2] transition-colors text-sm font-medium">
                  FAQ
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-[#1877f2] hover:text-[#1877f2] transition-colors text-sm font-medium">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
