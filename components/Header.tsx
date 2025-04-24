'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button, buttonVariants } from './ui/button'
import AdminButton from './AdminButton'
import Link from 'next/link'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-[#14095D]/80 backdrop-blur-lg py-5 px-6 sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-3">
                    <Image
                        src="/logo_sin_fondo.png"
                        alt="TECMITALK"
                        width={140}
                        height={48}
                        className="h-6 w-auto transition-transform duration-300 hover:scale-105"
                    />
                </Link>
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Menú móvil */}
                <div className={`md:hidden fixed inset-0 bg-[#14095D] backdrop-blur-lg transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-[60]`}>
                    <div>
                        <div className="p-6 space-y-8 relative h-full  bg-[#14095D]">
                            <button
                                className="absolute top-6 right-6 text-white/80 hover:text-white p-2 bg-[#14095D]"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Cerrar menú"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="space-y-8 pt-12 bg-[#14095D]">
                                <a href="/#speakers" className="block text-white/90 hover:text-tecmitalk-accent text-2xl font-medium" onClick={() => setIsMenuOpen(false)}>Ponentes</a>
                                <a href="/#talleres" className="block text-white/90 hover:text-tecmitalk-accent text-2xl font-medium" onClick={() => setIsMenuOpen(false)}>Talleres</a>
                                <a href="/#visita-empresarial" className="block text-white/90 hover:text-tecmitalk-accent text-2xl font-medium" onClick={() => setIsMenuOpen(false)}>Visita Empresarial</a>
                                <a href="/#tickets" className="block text-white/90 hover:text-tecmitalk-accent text-2xl font-medium" onClick={() => setIsMenuOpen(false)}>Tickets</a>
                                <a href="/#location" className="block text-white/90 hover:text-tecmitalk-accent text-2xl font-medium" onClick={() => setIsMenuOpen(false)}>Ubicación</a>
                            </div>
                            <div className="pt-12 space-y-6 w-full flex flex-col">
                                <Link
                                    href="/tickets"
                                    className={`group bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-tecmitalk-accent/30 transition-all duration-700 hover:-translate-y-2 max-sm:w-full text-custom-green h-11 ${buttonVariants({ variant: 'outline' })}`}
                                >
                                    Comprar Tickets
                                </Link>
                                <AdminButton />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menú desktop */}
                <div className="hidden md:flex space-x-8">
                    <a href="/#speakers" className="text-white/90 hover:text-tecmitalk-accent text-[17px] font-medium transition-colors duration-200">Ponentes</a>
                    <a href="/#talleres" className="text-white/90 hover:text-tecmitalk-accent text-[17px] font-medium transition-colors duration-200">Talleres</a>
                    <a href="/#visita-empresarial" className="text-white/90 hover:text-tecmitalk-accent text-[17px] font-medium transition-colors duration-200">Visita Empresarial</a>
                    <a href="/#tickets" className="text-white/90 hover:text-tecmitalk-accent text-[17px] font-medium transition-colors duration-200">Tickets</a>
                    <a href="/#location" className="text-white/90 hover:text-tecmitalk-accent text-[17px] font-medium transition-colors duration-200">Ubicación</a>
                </div>
                {/* Botones desktop */}
                <div className='hidden md:flex gap-4 items-center'>
                    <Link
                        href="/tickets"

                        className={`group bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-tecmitalk-accent/30 transition-all duration-700 hover:-translate-y-2 max-sm:w-full text-custom-green h-11 ${buttonVariants({ variant: 'outline' })}`}
                    >
                        Comprar Tickets
                    </Link>
                    <AdminButton />
                </div>
            </div>
        </nav>
    )
}
