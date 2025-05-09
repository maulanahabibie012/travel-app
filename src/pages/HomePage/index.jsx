import React from 'react'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import Footer from '../../components/Footer'


const HomePage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <div className="fixed top-0 left-0 w-full z-10">
                <Navbar />
            </div>
            <main>
                <Hero />
                <Footer />
            </main>
        </div>
    )
}

export default HomePage