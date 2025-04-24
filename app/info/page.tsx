'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Order {
  customer_name: string;
  customer_email: string;
}

interface OrderWorkshop {
  id: uuid;
  order_id: uuid;
  workshop_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  orders: {
    id: uuid;
    customer_name: string;
    customer_email: string;
  };
}

interface Workshop {
  id: number;
  name: string;
  description_workshop: string;
  leader_workshop: string;
  capacity: number;
  current_attendees: number;
  order_workshops: OrderWorkshop[];
}

export default function TallerAdmin() {
  const [talleres, setTalleres] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openWorkshopId, setOpenWorkshopId] = useState<string | null>(null);
  const [showAttendees, setShowAttendees] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenWorkshopId(openWorkshopId === id ? null : id);
  };

  const handleAttendeesToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setShowAttendees(showAttendees === id ? null : id);
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

    fetchTalleres();
  }, []);

  return (
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
                  openWorkshopId === taller.id
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
                    <span className="text-tecmitalk-accent">Imparte:</span> {taller.leader_workshop || "Por confirmar"}
                  </p>

                  <div
                    onClick={() => handleToggle(taller.id)}
                    className="text-white/80 text-sm mt-4 cursor-pointer group/details"
                  >
                    <div className="cursor-pointer text-tecmitalk-accent hover:text-tecmitalk-accent/80 transition-colors flex items-center bg-white/5 p-2 rounded-lg border border-white/10 hover:border-tecmitalk-accent/30 mt-2">
                      <span>Ver más detalles</span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                          openWorkshopId === taller.id ? 'rotate-180' : ''
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
                        openWorkshopId === taller.id
                          ? 'opacity-100 translate-y-0 max-h-[500px]'
                          : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
                      }`}
                    >
                      <p className="mt-2 text-white/90 bg-white/5 p-4 rounded-lg border border-white/10">
                        {taller.description_workshop || "Sin descripción disponible."}
                      </p>

                      <div className="mt-6 space-y-3 bg-gradient-to-r from-[#14095D]/80 to-[#0D063A]/80 p-4 rounded-lg border border-tecmitalk-accent/30 backdrop-blur-md shadow-lg">
                        <button
                          onClick={(e) => handleAttendeesToggle(e, taller.id)}
                          className="inline-block w-full text-center mt-2 text-sm bg-tecmitalk-accent hover:bg-tecmitalk-accent/90 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-tecmitalk-accent/30 font-medium flex items-center justify-center gap-2 group"
                        >
                          {showAttendees === taller.id ? 'Ocultar Asistentes' : 'Ver Asistentes'}
                        </button>

                        {showAttendees === taller.id && (
                          <div className="mt-4 space-y-3">
                            <h5 className="text-white font-semibold text-lg mb-4">Lista de Asistentes:</h5>
                            {taller.order_workshops && taller.order_workshops.length > 0 ? (
                              <div className="space-y-3 max-h-[400px] overflow-y-auto p-3 pb-8 pr-4 scrollbar-thin scrollbar-thumb-tecmitalk-accent/30 scrollbar-track-[#14095D]/30 rounded-lg border border-white/10 bg-white/5">
                                {taller.order_workshops.map((order, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-white/10 p-4 rounded-md hover:bg-white/15 transition-colors mb-3 last:mb-4"
                                  >
                                    <p className="text-white/90 text-sm mb-2">
                                      <span className="text-tecmitalk-accent font-medium">Nombre:</span> {order.orders.customer_name}
                                    </p>
                                    <p className="text-white/90 text-sm mb-2">
                                      <span className="text-tecmitalk-accent font-medium">Email:</span> {order.orders.customer_email}
                                    </p>
                                    <p className="text-white/90 text-sm">
                                      <span className="text-tecmitalk-accent font-medium">Cantidad:</span> {order.quantity}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-white/80 text-sm">No hay asistentes registrados aún.</p>
                            )}
                          </div>
                        )}
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
  );
}
