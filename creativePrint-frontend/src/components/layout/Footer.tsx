import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Twitter, Instagram, ArrowUp } from "lucide-react"

const socialIcons = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup logic
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Print On Demand</h3>
            <p className="text-gray-300">Turn your ideas into reality with our cutting-edge print-on-demand service.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Products", "About Us", "FAQ", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-purple-800 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 -bottom-6 text-green-400 text-sm"
                    >
                      Thank you for subscribing!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-white text-purple-700 px-6 py-2 rounded-md font-semibold hover:bg-purple-100 transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-purple-600 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Print On Demand. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialIcons.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-purple-300 transition-colors duration-200"
              >
                <span className="sr-only">{label}</span>
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-white text-purple-700 p-2 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp size={24} />
      </motion.button>
    </footer>
  )
}

