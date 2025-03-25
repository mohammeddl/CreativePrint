import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Package, 
  TrendingUp, 
  Award, 
  Globe, 
  Users 
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const AboutPage: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section 
          className="mb-16 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            About CreativePrint
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We're passionate about bringing your creative visions to life with our innovative print-on-demand service.
          </p>
        </motion.section>

        {/* Our Story Section */}
        <motion.section 
          className="mb-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Founded in 2019, CreativePrint began with a simple mission: to make it easy for anyone to bring their design ideas to life on high-quality products. What started as a small team of passionate designers and print specialists has grown into a full-service print-on-demand company serving customers worldwide.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We believe that everyone has creative potential, and our platform is designed to remove the barriers between imagination and reality. Whether you're an artist looking to sell your designs, a business seeking custom merchandise, or just someone with a great idea for a personalized gift, we provide the tools and expertise to make it happen.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Our commitment to quality, sustainability, and exceptional customer service has made us a trusted partner for thousands of creators and businesses around the globe.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl p-1">
                  <img 
                    src="/about-team.jpg" 
                    alt="CreativePrint Team" 
                    className="rounded-lg w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://sp.yimg.com/ib/th?id=OIP.ZXFwsOYjVUdPVsX69DcVdAHaHa&pid=Api&w=148&h=148&c=7&dpr=2&rs=1";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Palette, 
                title: "Creativity", 
                description: "We foster an environment where creativity thrives and innovative ideas are celebrated." 
              },
              { 
                icon: Package, 
                title: "Quality", 
                description: "We never compromise on quality, from the materials we use to the user experience we provide." 
              },
              { 
                icon: TrendingUp, 
                title: "Growth", 
                description: "We're committed to continuous improvement and helping our customers grow their businesses." 
              },
              { 
                icon: Award, 
                title: "Excellence", 
                description: "We strive for excellence in everything we do, setting high standards for our work." 
              },
              { 
                icon: Globe, 
                title: "Sustainability", 
                description: "We're dedicated to environmentally responsible practices and reducing our carbon footprint." 
              },
              { 
                icon: Users, 
                title: "Community", 
                description: "We value the communities we serve and aim to make a positive impact through our work." 
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section 
          className="mb-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg overflow-hidden text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose CreativePrint</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Premium Quality Products</h3>
                    <p className="text-white/80">We source only the finest materials to ensure your designs look their best and your products last for years.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Advanced Design Tools</h3>
                    <p className="text-white/80">Our intuitive design tools make it easy to create professional-looking products, no design experience needed.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Fast Production Time</h3>
                    <p className="text-white/80">Most orders are processed within 3-5 business days, getting your creations to you as quickly as possible.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Eco-Friendly Options</h3>
                    <p className="text-white/80">We offer sustainably produced products and eco-conscious shipping options to reduce environmental impact.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Reliable Customer Support</h3>
                    <p className="text-white/80">Our dedicated support team is always ready to help with any questions or concerns you might have.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-sm font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">No Minimum Orders</h3>
                    <p className="text-white/80">Order exactly what you need, whether it's a single item or thousands, with no minimum quantity requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        {/* CTA Section */}
        <motion.section 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Start Creating?</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of satisfied customers who have brought their creative ideas to life with CreativePrint.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md">
                  Get Started Today
                </button>
                <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;