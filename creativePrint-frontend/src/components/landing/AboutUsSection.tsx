import { motion } from "framer-motion"
import { useAnimation } from "../../hooks/useAnimation"
import { ArrowRight, Printer, Truck, Palette, Recycle } from "lucide-react"
import { useState } from "react"

const features = [
  {
    title: "Custom Designs",
    description: "Create unique products with your own designs or use our design services.",
    icon: Palette,
  },
  {
    title: "High-Quality Printing",
    description: "State-of-the-art printing technology for vibrant, long-lasting results.",
    icon: Printer,
  },
  {
    title: "Fast Shipping",
    description: "Quick processing and reliable shipping to get your products to you on time.",
    icon: Truck,
  },
  {
    title: "Eco-Friendly Options",
    description: "Sustainable materials and eco-conscious printing processes.",
    icon: Recycle,
  },
]

export default function AboutUsSection() {
  const { ref, inView } = useAnimation(0.1)
  const [activeFeature, setActiveFeature] = useState(0)

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Image and animated elements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src="https://barn2.com/wp-content/uploads/2022/07/Best-Print-on-Demand-WooCommerce-Plugins-for-2022.png"
                  alt="Print on Demand Process"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Animated overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-indigo-600/20"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Floating badges */}
              <motion.div
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center space-x-2">
                  <Printer className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Premium Quality</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Fast Delivery</span>
                </div>
              </motion.div>
            </div>

            {/* Stats cards */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">5K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">100+</p>
                <p className="text-sm text-gray-600">Product Options</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About Our{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Print On Demand
                </span>{" "}
                Service
              </h2>
              <p className="text-lg text-gray-700">
                At PrintOnDemand, we're passionate about bringing your creative visions to life. Our state-of-the-art
                printing technology and dedicated team ensure that every product we create meets the highest standards
                of quality and design.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeFeature === index
                      ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        activeFeature === index ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 flex items-center space-x-2 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
