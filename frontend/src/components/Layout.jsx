import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-earth-800 text-earth-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Sustainable Fertilizer Optimizer. Promoting sustainable agriculture.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
