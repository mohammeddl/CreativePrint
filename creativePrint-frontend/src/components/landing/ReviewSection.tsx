"use client"

import { motion } from "framer-motion"
import { useAnimation } from "../../hooks/useAnimation"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useState, useEffect } from "react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The quality of the prints exceeded my expectations. I'll definitely be ordering again! The customer service was also exceptional.",
    rating: 5,
    position: "Marketing Director",
    company: "CreativeMinds Inc.",
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "Fast shipping and great customer service. They helped me with my custom design and made sure everything was perfect before printing.",
    rating: 4,
    position: "Entrepreneur",
    company: "TechStart Solutions",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "Love the variety of products available. I've ordered t-shirts and mugs, both turned out great. Will definitely use their services again.",
    rating: 5,
    position: "Event Coordinator",
    company: "Celebration Events",
  },
  {
    id: 4,
    name: "David Wilson",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "Impressive print quality and the colors are vibrant. My clients were very happy with the promotional materials I ordered.",
    rating: 5,
    position: "Design Consultant",
    company: "Visual Concepts",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function ReviewSection() {
  const { ref, inView } = useAnimation(0.1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const nextSlide = () => {
    setAutoplay(false)
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevSlide = () => {
    setAutoplay(false)
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToSlide = (index: number) => {
    setAutoplay(false)
    setActiveIndex(index)
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 inline-block">
            What Our Customers Say
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Large quote icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.05 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <Quote className="w-40 h-40 text-purple-600" />
          </motion.div>

          {/* Reviews carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="overflow-hidden">
              <motion.div
                key={activeIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-purple-100">
                        <img
                          src={reviews[activeIndex].image || "/placeholder.svg"}
                          alt={reviews[activeIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <StarRating rating={reviews[activeIndex].rating} />
                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">"{reviews[activeIndex].content}"</p>
                    <div className="mt-6">
                      <h4 className="font-bold text-gray-900">{reviews[activeIndex].name}</h4>
                      <p className="text-sm text-gray-600">
                        {reviews[activeIndex].position}, {reviews[activeIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "bg-purple-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
