import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAnimation } from "../../hooks/useAnimation"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

const faqs = [
  {
    question: "How does print-on-demand work?",
    answer:
      "Print-on-demand allows you to create custom products without holding inventory. When a customer places an order, we print and ship the product directly to them.",
    category: "general",
  },
  {
    question: "What types of products can I customize?",
    answer:
      "We offer a wide range of customizable products including t-shirts, hoodies, mugs, phone cases, and more. Check our product catalog for the full list.",
    category: "products",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary depending on the product and destination. Typically, orders are processed within 3-5 business days and shipped within 5-10 business days.",
    category: "shipping",
  },
  {
    question: "Can I see a sample before placing a bulk order?",
    answer:
      "Yes, we offer sample orders for most of our products. This allows you to check the quality and make any necessary adjustments before placing a larger order.",
    category: "orders",
  },
  {
    question: "What file formats do you accept for printing?",
    answer:
      "We accept high-resolution PNG, JPG, PDF, and AI files. For best results, please ensure your images are at least 300 DPI and use CMYK color mode for accurate color reproduction.",
    category: "design",
  },
  {
    question: "Do you offer design services?",
    answer:
      "Yes, our team of professional designers can help bring your ideas to life. We offer custom design services at competitive rates. Contact us for a quote.",
    category: "design",
  },
]

const categories = ["all", "general", "products", "shipping", "orders", "design"]

function FAQItem({
  question,
  answer,
  isOpen,
  toggleOpen,
}: {
  question: string
  answer: string
  isOpen: boolean
  toggleOpen: () => void
}) {
  return (
    <motion.div
      className="border-b border-gray-200 last:border-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="flex justify-between items-center w-full text-left py-5 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0 text-purple-600"
        >
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5">
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const { ref, inView } = useAnimation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 inline-block">
            Frequently Asked Questions
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                activeCategory === category
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-200"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleOpen={() => toggleFAQ(index)}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">No FAQs found matching your search criteria.</div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
