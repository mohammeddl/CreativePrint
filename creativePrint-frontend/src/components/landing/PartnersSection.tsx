import { motion } from "framer-motion"
import { useInView } from "../../hooks/useInView"

const partners = [
  { name: "Company A", logo: "/logo-a.svg" },
  { name: "Company B", logo: "/logo-b.svg" },
  { name: "Company C", logo: "/logo-c.svg" },
  { name: "Company D", logo: "/logo-d.svg" },
  { name: "Company E", logo: "/logo-e.svg" },
  { name: "Company F", logo: "/logo-f.svg" },
]

export default function PartnersSection() {
  const [ref, inView] = useInView() as [React.RefObject<HTMLElement>, boolean]

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Our Partners & Sponsors
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="col-span-1 flex justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img className="h-12" src={partner.logo || "../../../public/assets/images/default-avatar.png"} alt={partner.name} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

