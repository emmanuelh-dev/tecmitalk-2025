'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface Order {
  customer_name: string;
  customer_email: string;
}

interface OrderWorkshop {
  id: string;
  order_id: string;
  workshop_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  orders: {
    id: string;
    customer_name: string;
    customer_email: string;
  };
}

interface Workshop {
  id: number;
  name: string;
  description_workshop: string;
  leadear_worshop: string;
  capacity: number;
  current_attendees: number;
  order_workshops: OrderWorkshop[];
}

interface OrderCorporateVisit {
  id: string;
  order_id: string;
  corporate_visit_id: number;
  quantity: number;
  orders: {
    id: string;
    customer_name: string;
    customer_email: string;
  };
}

interface CorporateVisit {
  id: number;
  name: string;
  starting_time: string;
  capacity: number;
  current_attendees: number;
  order_corporate_visits: OrderCorporateVisit[];
}

export default function TallerAdmin() {
  const [talleres, setTalleres] = useState<Workshop[]>([]);
  const [visitasEmpresariales, setVisitasEmpresariales] = useState<CorporateVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVisitas, setLoadingVisitas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorVisitas, setErrorVisitas] = useState<string | null>(null);
  const [openWorkshopId, setOpenWorkshopId] = useState<string | null>(null);
  const [openVisitId, setOpenVisitId] = useState<string | null>(null);

  const handleToggle = (id: number) => {
    setOpenWorkshopId(openWorkshopId === String(id) ? null : String(id));
  };

  const handleToggleVisit = (id: number) => {
    setOpenVisitId(openVisitId === String(id) ? null : String(id));
  };

  useEffect(() => {
    const fetchTalleres = async () => {
      const supabase = createClient();
      try {
        console.log('Iniciando fetch de talleres...');
        const { data, error } = await supabase
          .from('workshops')
          .select(`
            *,
            order_workshops!inner (
              id,
              order_id,
              quantity,
              created_at,
              orders!inner (
                id,
                customer_name,
                customer_email
              )
            )
          `)
          .order('name');

        if (error) {
          console.error('Error de Supabase:', error);
          setError('Error al cargar los talleres: ' + error.message);
          throw error;
        }

        console.log('Talleres recibidos:', data);
        setTalleres(data || []);
      } catch (error) {
        console.error('Error al cargar talleres:', error);
        setError('Error al cargar los talleres. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    const fetchVisitasEmpresariales = async () => {
      const supabase = createClient();
      try {
        console.log('Iniciando fetch de visitas empresariales...');
        const { data, error } = await supabase
          .from('corporate_visit')
          .select(`
            *,
            order_corporate_visits!inner (
              id,
              order_id,
              quantity,
              created_at,
              orders!inner (
                id,
                customer_name,
                customer_email
              )
            )
          `)
          .order('name');

        if (error) {
          console.error('Error de Supabase:', error);
          setErrorVisitas('Error al cargar las visitas empresariales: ' + error.message);
          throw error;
        }

        console.log('Visitas empresariales recibidas:', data);
        setVisitasEmpresariales(data || []);
      } catch (error) {
        console.error('Error al cargar visitas empresariales:', error);
        setErrorVisitas('Error al cargar las visitas empresariales. Por favor, intenta más tarde.');
      } finally {
        setLoadingVisitas(false);
      }
    };

    fetchTalleres();
    fetchVisitasEmpresariales();
  }, []);

  return (
    <>
      <section id="talleres" className="py-24 bg-gradient-to-b from-[#0D063A] to-[#14095D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Nuestros <span className="text-tecmitalk-accent">talleres</span>
            </h3>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-8 bg-red-100/10 p-4 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-white text-center">
              <p>Cargando talleres...</p>
              <div className="mt-4 animate-spin h-8 w-8 border-4 border-tecmitalk-accent border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : talleres.length === 0 ? (
            <p className="text-white text-center">No hay talleres disponibles en este momento.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {talleres.map((taller) => (
                <div
                  key={taller.id}
                  className={`relative overflow-hidden rounded-2xl group transition-all duration-500 bg-white/5 backdrop-blur-lg border ${
                    openWorkshopId === String(taller.id)
                      ? "border-[#2DDC2F] scale-105 shadow-2xl shadow-tecmitalk-accent/20"
                      : "border-white/10"
                  } hover:border-[#2DDC2F] hover:scale-[1.02] hover:shadow-lg hover:shadow-tecmitalk-accent/10 transform`}
                >
                  <div className="p-6 space-y-4 relative">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-tecmitalk-accent transition-colors">
                        {taller.name}
                      </h4>
                      <Badge className="bg-tecmitalk-accent/20 text-tecmitalk-accent border-tecmitalk-accent/30 hover:bg-tecmitalk-accent/30">
                        {taller.capacity - taller.current_attendees} lugares
                      </Badge>
                    </div>

                    <p className="text-white/80 text-sm flex items-center gap-2">
                      <span className="text-tecmitalk-accent">Imparte:</span> {taller.leadear_worshop || "Por confirmar"}
                    </p>

                    <div
                      onClick={() => handleToggle(taller.id)}
                      className="text-white/80 text-sm mt-4 cursor-pointer group/details"
                    >
                      <div className="cursor-pointer text-tecmitalk-accent hover:text-tecmitalk-accent/80 transition-colors flex items-center bg-white/5 p-2 rounded-lg border border-white/10 hover:border-tecmitalk-accent/30 mt-2">
                        <span>Ver más detalles</span>
                        <svg
                          className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                            openWorkshopId === String(taller.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      <div
                        className={`mt-4 transition-all duration-500 ease-in-out ${
                          openWorkshopId === String(taller.id)
                            ? 'opacity-100 translate-y-0 max-h-[500px]'
                            : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
                        }`}
                      >
                        <p className="mt-2 text-white/90 bg-white/5 p-4 rounded-lg border border-white/10">
                          {taller.description_workshop || "Sin descripción disponible."}
                        </p>

                        <div className="mt-6 space-y-3 bg-gradient-to-r from-[#14095D]/80 to-[#0D063A]/80 p-4 rounded-lg border border-tecmitalk-accent/30 backdrop-blur-md shadow-lg">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block w-full text-center mt-2 text-sm bg-tecmitalk-accent hover:bg-tecmitalk-accent/90 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-tecmitalk-accent/30 font-medium flex items-center justify-center gap-2 group"
                              >
                                Ver Asistentes
                              </button>
                            </DialogTrigger>
                            
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0D063A] border-tecmitalk-accent/30">
                              <div className="relative">
                                <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                                  <X className="h-5 w-5 text-white/80 hover:text-white" />
                                  <span className="sr-only">Cerrar</span>
                                </DialogClose>
                                <DialogHeader>
                                  <DialogTitle className="text-2xl text-white pr-6">
                                    Asistentes de: {taller.name}
                                  </DialogTitle>
                                </DialogHeader>
                              </div>
                              
                              <div className="mt-6">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="text-white/80">
                                    <span className="text-tecmitalk-accent font-medium">Capacidad:</span> {taller.capacity} | 
                                    <span className="text-tecmitalk-accent font-medium ml-2">Disponibles:</span> {taller.capacity - taller.current_attendees}
                                  </div>
                                  <Badge className="bg-tecmitalk-accent/20 text-tecmitalk-accent text-sm py-1 px-3">
                                    Total asistentes: {taller.current_attendees}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-4">
                                  {taller.order_workshops && taller.order_workshops.length > 0 ? (
                                    <div className="grid gap-4">
                                      {taller.order_workshops.map((order, index) => (
                                        <div 
                                          key={index} 
                                          className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-tecmitalk-accent/50 transition-colors"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-4">
                                              <p className="text-xs text-white/60 mb-1">Nombre</p>
                                              <p className="text-white font-medium truncate">{order.orders.customer_name}</p>
                                            </div>
                                            <div className="md:col-span-6">
                                              <p className="text-xs text-white/60 mb-1">Correo electrónico</p>
                                              <p className="text-white font-medium break-all">{order.orders.customer_email}</p>
                                            </div>
                                            <div className="md:col-span-2 text-right">
                                              <p className="text-xs text-white/60 mb-1">Boletos</p>
                                              <p className="text-tecmitalk-accent font-bold text-lg">{order.quantity}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-12">
                                      <p className="text-white/70 text-lg">No hay asistentes registrados aún.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sección de Visitas Empresariales */}
      <section id="visitas-empresariales" className="py-24 bg-gradient-to-b from-[#14095D] to-[#0D063A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Visitas <span className="text-tecmitalk-accent">Empresariales</span>
            </h3>
          </div>

          {errorVisitas && (
            <div className="text-red-500 text-center mb-8 bg-red-100/10 p-4 rounded-lg">
              {errorVisitas}
            </div>
          )}

          {loadingVisitas ? (
            <div className="text-white text-center">
              <p>Cargando visitas empresariales...</p>
              <div className="mt-4 animate-spin h-8 w-8 border-4 border-tecmitalk-accent border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : visitasEmpresariales.length === 0 ? (
            <p className="text-white text-center">No hay visitas empresariales disponibles en este momento.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {visitasEmpresariales.map((visita) => (
                <div
                  key={visita.id}
                  className={`relative overflow-hidden rounded-2xl group transition-all duration-500 bg-white/5 backdrop-blur-lg border ${
                    openVisitId === String(visita.id)
                      ? "border-[#2DDC2F] scale-105 shadow-2xl shadow-tecmitalk-accent/20"
                      : "border-white/10"
                  } hover:border-[#2DDC2F] hover:scale-[1.02] hover:shadow-lg hover:shadow-tecmitalk-accent/10 transform`}
                >
                  <div className="p-6 space-y-4 relative">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-tecmitalk-accent transition-colors">
                        {visita.name}
                      </h4>
                      <Badge className="bg-tecmitalk-accent/20 text-tecmitalk-accent border-tecmitalk-accent/30 hover:bg-tecmitalk-accent/30">
                        {visita.capacity - visita.current_attendees} lugares
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">                      
                      {visita.starting_time && (
                        <div className="bg-blue-900/30 px-3 py-1.5 rounded-md inline-flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-tecmitalk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white text-sm">
                            {new Date(`1970-01-01T${visita.starting_time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => handleToggleVisit(visita.id)}
                      className="text-white/80 text-sm mt-4 cursor-pointer group/details"
                    >
                      <div className="cursor-pointer text-tecmitalk-accent hover:text-tecmitalk-accent/80 transition-colors flex items-center bg-white/5 p-2 rounded-lg border border-white/10 hover:border-tecmitalk-accent/30 mt-2">
                        <span>Ver más detalles</span>
                        <svg
                          className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                            openVisitId === String(visita.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      <div
                        className={`mt-4 transition-all duration-500 ease-in-out ${
                          openVisitId === String(visita.id)
                            ? 'opacity-100 translate-y-0 max-h-[500px]'
                            : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
                        }`}
                      >


                        <div className="mt-6 space-y-3 bg-gradient-to-r from-[#14095D]/80 to-[#0D063A]/80 p-4 rounded-lg border border-tecmitalk-accent/30 backdrop-blur-md shadow-lg">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block w-full text-center mt-2 text-sm bg-tecmitalk-accent hover:bg-tecmitalk-accent/90 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-tecmitalk-accent/30 font-medium flex items-center justify-center gap-2 group"
                              >
                                Ver Asistentes
                              </button>
                            </DialogTrigger>
                            
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0D063A] border-tecmitalk-accent/30">
                              <div className="relative">
                                <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                                  <X className="h-5 w-5 text-white/80 hover:text-white" />
                                  <span className="sr-only">Cerrar</span>
                                </DialogClose>
                                <DialogHeader>
                                  <DialogTitle className="text-2xl text-white pr-6">
                                    Asistentes de: {visita.name}
                                  </DialogTitle>
                                </DialogHeader>
                              </div>
                              
                              <div className="mt-6">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="text-white/80">
                                    <span className="text-tecmitalk-accent font-medium">Capacidad:</span> {visita.capacity} | 
                                    <span className="text-tecmitalk-accent font-medium ml-2">Disponibles:</span> {visita.capacity - visita.current_attendees}
                                  </div>
                                  <Badge className="bg-tecmitalk-accent/20 text-tecmitalk-accent text-sm py-1 px-3">
                                    Total asistentes: {visita.current_attendees}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-4">
                                  {visita.order_corporate_visits && visita.order_corporate_visits.length > 0 ? (
                                    <div className="grid gap-4">
                                      {visita.order_corporate_visits.map((order, index) => (
                                        <div 
                                          key={index} 
                                          className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-tecmitalk-accent/50 transition-colors"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-4">
                                              <p className="text-xs text-white/60 mb-1">Nombre</p>
                                              <p className="text-white font-medium truncate">{order.orders.customer_name}</p>
                                            </div>
                                            <div className="md:col-span-6">
                                              <p className="text-xs text-white/60 mb-1">Correo electrónico</p>
                                              <p className="text-white font-medium break-all">{order.orders.customer_email}</p>
                                            </div>
                                            <div className="md:col-span-2 text-right">
                                              <p className="text-xs text-white/60 mb-1">Boletos</p>
                                              <p className="text-tecmitalk-accent font-bold text-lg">{order.quantity}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-12">
                                      <p className="text-white/70 text-lg">No hay asistentes registrados aún.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}