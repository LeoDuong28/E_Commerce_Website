import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FiShield, FiZap, FiLifeBuoy, FiDollarSign, FiArrowRight, FiMonitor } from "react-icons/fi";
import { SiGithub, SiLinkedin } from "react-icons/si";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "50+", label: "Brands" },
  { value: "24/7", label: "Support" },
];

const values = [
  {
    icon: <FiShield className="w-8 h-8" />,
    title: "Quality Guaranteed",
    description: "Every product is carefully selected and tested to ensure premium quality and durability.",
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: "Fast Shipping",
    description: "Quick and reliable delivery to get your tech gear to you as soon as possible.",
  },
  {
    icon: <FiLifeBuoy className="w-8 h-8" />,
    title: "Expert Support",
    description: "Our knowledgeable team is always ready to help you find the perfect products.",
  },
  {
    icon: <FiDollarSign className="w-8 h-8" />,
    title: "Best Prices",
    description: "Competitive pricing on all products with regular deals and discounts.",
  },
];

const team = [
  {
    name: "Leo Duong",
    role: "Founder & Developer",
    bio: "Full-stack developer passionate about creating exceptional e-commerce experiences.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-block px-4 py-1.5 bg-[#1877f2]/20 text-[#1877f2] rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Trusted Destination for
              <span className="text-[#1877f2]"> Premium Tech</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We're passionate about bringing you the best in gaming gear, audio equipment, and tech accessories. Quality products, competitive prices, and exceptional service.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#1877f2]">{stat.value}</p>
                  <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#1877f2] font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                  Built by Gamers, For Gamers
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    What started as a passion project has grown into a trusted destination for tech enthusiasts worldwide. We understand the importance of quality gear because we use it ourselves every day.
                  </p>
                  <p>
                    Our mission is simple: to provide premium gaming and tech products at fair prices, backed by exceptional customer service. We carefully curate our selection to ensure every product meets our high standards.
                  </p>
                  <p>
                    Whether you're a professional gamer, content creator, or simply someone who appreciates quality tech, we're here to help you find exactly what you need.
                  </p>
                </div>
                <Link
                  href="/all-products"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#1877f2] hover:bg-[#1466d8] text-white font-medium rounded-lg transition-colors"
                >
                  Explore Products
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1877f2]/20 to-purple-500/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#1877f2]/10 flex items-center justify-center">
                      <FiMonitor className="w-16 h-16 text-[#1877f2]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Premium Tech Store</h3>
                    <p className="text-gray-600 mt-2">Gaming • Audio • Accessories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#1877f2] font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-[#1877f2]/5 transition-colors group">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center group-hover:bg-[#1877f2] group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#1877f2] font-semibold text-sm uppercase tracking-wider">Meet The Team</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">The People Behind The Store</h2>
            </div>
            <div className="flex justify-center">
              {team.map((member, index) => (
                <div key={index} className="text-center max-w-sm">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-[#1877f2]/20 bg-[#1877f2] flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-[#1877f2] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <a
                      href="https://github.com/LeoDuong28"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#1877f2] transition-colors"
                    >
                      <SiGithub className="w-6 h-6" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/leo-duong-836334280"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#1877f2] transition-colors"
                    >
                      <SiLinkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-[#1877f2]">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up Your Setup?</h2>
            <p className="text-xl text-blue-100 mb-8">Browse our collection of premium tech products today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/all-products"
                className="px-8 py-3 bg-white text-[#1877f2] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
