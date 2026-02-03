"use client"
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Monitor from './icons/Monitor';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent px-4 py-3">

        <nav className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
                <Monitor className='text-white'/>
                <h2 className='text-green-200 text-2xl font-semibold ml-2 mr-4'>
                    DevOntario
                </h2>
            </div>

            <div className="flex items-center">
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>

                <div className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li>
                            <Link href="#events" className="text-white hover:text-green-300 transition-colors">
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link href="#about" className="text-white hover:text-green-300 transition-colors">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="#contact" className="text-white hover:text-green-300 transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    </header>
  )
}
export default Navbar
