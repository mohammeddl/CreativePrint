import Head from "next/head"
import HeroSection from "../../components/landing/HeroSection"
import FAQSection from "../../components/landing/FAQSection"
import ReviewSection from "../../components/landing/ReviewSection"
import PartnersSection from "../../components/landing/PartnersSection"
import AboutUsSection from "../../components/landing/AboutUsSection"
import Footer from "../../components/layout/Footer"

export default function LandingPage() {
  return (
    <div>
      <Head>
        <title>Print On Demand - Your Imagination, Our Creation</title>
        <meta name="description" content="Turn your ideas into reality with our print-on-demand service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeroSection />
        <AboutUsSection />
        <ReviewSection />
        <FAQSection />
        <PartnersSection />
        <Footer />
      </main>
    </div>
  )
}

