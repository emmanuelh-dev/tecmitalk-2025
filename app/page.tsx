'use client'
import Image from 'next/image'
import Location from '@/components/sections/Location'
import Tickets from '@/components/sections/Tickets'
import Talleres from '@/components/sections/Talleres'
import Ponentes from '@/components/sections/Ponentes'
import VisitaEmpresarial from '@/components/sections/VisitaEmpresarial'
import TecmiTalkSchedule from '@/components/TecmiTalkSchedule'

export default function Home() {


  return (
    <div className="min-h-screen flex flex-col bg-[#14095D] bg-opacity-95">
      {/* Hero Section */}
      <div className="flex-grow">
        <div className="max-w-7xl w-full mx-auto py-32 px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <h2 className="text-sm font-medium text-tecmitalk-accent mb-4 tracking-[0.2em]">#LEADYOURPATH</h2>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
                  TecmiTalk 2025
                  <span className="bg-gradient-to-r from-tecmitalk-accent to-emerald-400 bg-clip-text text-transparent block">Inspirar, aprender y conectar </span>
                </h1>
              </div>

              <p className="text-xl text-gray-200/90 leading-relaxed max-w-2xl">
                Un espacio diseñado para inspirar, aprender y conectar con personas que buscan generar un impacto en sus industrias y en la sociedad.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="inline-flex items-center border border-white/20 rounded-xl px-5 py-3 text-white/90 backdrop-blur-sm hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  29 de Abril del 2025
                </div>
                <div className="inline-flex items-center border border-white/20 rounded-xl px-5 py-3 text-white/90 backdrop-blur-sm hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Visita Empresarial 30
                </div>
                <div className="inline-flex items-center border border-white/30 rounded-full px-4 py-2 text-white/90 backdrop-blur-sm hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  9:00 a.m. - 6:00 p.m.
                </div>
                <div className="inline-flex items-center border border-white/30 rounded-full px-4 py-2 text-white/90 backdrop-blur-sm hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Tecmilenio San Nicolás
                </div>
              </div>
            </div>
            <div className="w-full lg:max-w-2xl transform hover:scale-[1.02] transition-transform duration-300 ease-out">
              <div className="relative w-full" style={{ aspectRatio: '16/7.2' }}>
                <Image
                  src="/boleto_priority.svg"
                  alt="boleto_priority"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="left"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <TecmiTalkSchedule />
        {/* Why Attend Section */}
        <section className="bg-white/5 py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 space-y-5">
              <h3 className="text-4xl md:text-5xl font-bold text-white bg-clip-text bg-gradient-to-r from-white to-tecmitalk-accent">
                Razones para participar
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-b from-white/5 to-transparent p-8 rounded-2xl border border-white/10 hover:border-tecmitalk-accent/30 transition-all duration-300 hover:-translate-y-2">
                <div className="text-tecmitalk-accent text-4xl font-bold mb-6">01</div>
                <h4 className="text-2xl font-semibold text-white mb-4">Inspiración de Expertos</h4>
                <p className="text-gray-300/80 leading-relaxed">
                  Escucha a líderes de la innovación y el emprendimiento compartir sus experiencias, estrategias y consejos para impulsar tu crecimiento personal y profesional.
                </p>
              </div>

              <div className="group bg-gradient-to-b from-white/5 to-transparent p-8 rounded-2xl border border-white/10 hover:border-tecmitalk-accent/30 transition-all duration-300 hover:-translate-y-2">
                <div className="text-tecmitalk-accent text-4xl font-bold mb-4">02</div>
                <h4 className="text-xl font-bold text-white mb-3">Networking de Alto Nivel</h4>
                <p className="text-gray-200">Conéctate con emprendedores, inversionistas y profesionales de diversas industrias. Amplía tu red de contactos y encuentra nuevas oportunidades de colaboración.</p>
              </div>

              <div className="group bg-gradient-to-b from-white/5 to-transparent p-8 rounded-2xl border border-white/10 hover:border-tecmitalk-accent/30 transition-all duration-300 hover:-translate-y-2">
                <div className="text-tecmitalk-accent text-4xl font-bold mb-4">03</div>
                <h4 className="text-xl font-bold text-white mb-3">Aprendizaje Práctico</h4>
                <p className="text-gray-200">Talleres, paneles y charlas con contenido valioso que podrás aplicar de inmediato en tus proyectos y en tu desarrollo personal.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers Section */}
        <Ponentes />
        {/* Workshops Section */}
        <Talleres />
        
        {/* Visita Empresarial Section */}
        <VisitaEmpresarial />

        {/* Tickets Section */}
        <Tickets />

        {/* Location Section */}
        <Location />
      </div>
    </div>
  )
}