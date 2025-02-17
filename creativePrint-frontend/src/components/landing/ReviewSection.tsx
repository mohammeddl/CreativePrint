import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/user1.jpg",
    content: "The quality of the prints exceeded my expectations. I'll definitely be ordering again!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/user2.jpg",
    content: "Fast shipping and great customer service. They helped me with my custom design.",
    rating: 4,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "/user3.jpg",
    content: "Love the variety of products available. I've ordered t-shirts and mugs, both turned out great.",
    rating: 5,
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-gray-600 flex-grow">{review.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

