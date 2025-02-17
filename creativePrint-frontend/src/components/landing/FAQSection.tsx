import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "../../hooks/useInView"

const faqs = [
  {
    question: "How does print-on-demand work?",
    answer:
      "Print-on-demand allows you to create custom products without holding inventory. When a customer places an order, we print and ship the product directly to them.",
  },
  {
    question: "What types of products can I customize?",
    answer:
      "We offer a wide range of customizable products including t-shirts, hoodies, mugs, phone cases, and more. Check our product catalog for the full list.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary depending on the product and destination. Typically, orders are processed within 3-5 business days and shipped within 5-10 business days.",
  },
  {
    question: "Can I see a sample before placing a bulk order?",
    answer:
      "Yes, we offer sample orders for most of our products. This allows you to check the quality and make any necessary adjustments before placing a larger order.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <motion.svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          ) : (
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-2 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [ref, inView] = useInView()

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

