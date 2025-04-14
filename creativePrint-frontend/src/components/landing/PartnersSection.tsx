"use client"

import { motion } from "framer-motion"
import { useAnimation } from "../../hooks/useAnimation"
import { useState } from "react"

const partners = [
  { name: "OCP", logo: "data:image/jpeg;base64,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" },
  { name: "SIMPLON", logo: "https://evenement.simplon.co/hs-fs/hubfs/SIMPLON_LOGO_2024%20(1).png?width=1920&height=592&name=SIMPLON_LOGO_2024%20(1).png" },
  { name: "YOUCODE", logo: "data:image/jpeg;base64,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" },
  // { name: "Company D", logo: "/placeholder.svg?height=48&width=120" },
  // { name: "Company E", logo: "/placeholder.svg?height=48&width=120" },
  // { name: "Company F", logo: "/placeholder.svg?height=48&width=120" },
]

export default function PartnersSection() {
  const { ref, inView } = useAnimation(0.1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 inline-block">
            Our Partners & Sponsors
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="col-span-1 flex justify-center items-center"
            >
              <motion.div
                className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-24 flex items-center justify-center group"
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.img
                  className="h-12 transition-all duration-300 group-hover:scale-110"
                  src={partner.logo}
                  alt={partner.name}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={hoveredIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-1 left-0 right-0 text-center text-xs font-medium text-gray-600"
                >
                  {partner.name}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
