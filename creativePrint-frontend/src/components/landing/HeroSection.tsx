import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedSphere() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Sphere args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial color="#8B5CF6" attach="material" distort={0.3} speed={1.5} roughness={0.5} />
    </Sphere>
  )
}

export default function HeroSection() {
  const [hovered, setHovered] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedSphere />
        </Canvas>
      </motion.div>
      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {"Print Your Imagination".split("").map((letter, index) => (
            <motion.span key={index} variants={letterVariants}>
              {letter}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Turn your ideas into reality with our print-on-demand service
        </motion.p>
        <motion.button
          className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Get Started
          <motion.span className="ml-2" initial={{ x: 0 }} animate={{ x: hovered ? 5 : 0 }}>
            →
          </motion.span>
        </motion.button>
      </div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white rounded-full p-1"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="w-1 h-3 bg-white rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  )
}

