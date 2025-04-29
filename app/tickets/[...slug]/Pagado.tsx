import { type Order, type OrderItem } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { createClient } from '@/lib/supabase/client'

function Boleto({ orderItems }: { orderItems: OrderItem }) {
  const ticketImages = {
    'Boleto VIP': '/vip.svg',
    'Boleto Priority': '/boleto_priority.svg',
    'Boleto General': '/general.svg'
  } as const;

  const url_boleto = ticketImages[orderItems?.tickets?.name as keyof typeof ticketImages] || '/boleto_priority.svg';

  return (
    <Image
      src={url_boleto}
      alt={orderItems?.tickets?.name || 'Boleto Priority'}
      className="w-full object-cover"
      width={500}
      height={500}
    />
  )
}

export default function Pagado({ order, orderItems }: { order: Order, orderItems: OrderItem[] }) {
  const [workshopDetails, setWorkshopDetails] = useState<any[]>([]);
  const [corporateVisitDetails, setCorporateVisitDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      if (!order || !order.id) return;
      
      const supabase = createClient();
      
      try {
        // Obtener detalles de talleres
        const { data: workshopData, error: workshopError } = await supabase
          .from('order_workshops')
          .select(`
            *,
            workshops:workshop_id (id, name, description_workshop, leadear_worshop)
          `)
          .eq('order_id', order.id);
          
        if (workshopError) throw workshopError;
        setWorkshopDetails(workshopData || []);
        
        // Obtener detalles de visitas empresariales
        const { data: corporateData, error: corporateError } = await supabase
          .from('order_corporate_visits')
          .select(`
            *,
            corporate_visits:corporate_visit_id (id, name, starting_time)
          `)
          .eq('order_id', order.id);
          
        if (corporateError) throw corporateError;
        setCorporateVisitDetails(corporateData || []);
      } catch (err) {
        console.error('Error al cargar detalles adicionales:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdditionalDetails();
  }, [order]);

  return (
    <div className="min-h-screen bg-[#14095D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white/5 rounded-xl border border-tecmitalk-accent/30 p-6 md:p-8">
        <Link href="/" className="inline-flex items-center text-tecmitalk-accent hover:text-tecmitalk-accent/80 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">Detalles de tu Orden</h1>
        {
          !order.paid ? (
            <div className='py-20 text-center w-full '>
              <p className='text-white'>Estamos generando tu boleto</p>
            </div>
          ) :
            (
              <div>
                <Boleto orderItems={orderItems[0]} />
              </div>
            )
        }



        {order && (
          <div className="space-y-8 mt-8">
            {/* Información de la orden */}
            <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6 flex justify-center items-center">
              <div className="text-gray-300">
                <QRCode value={`https://tecmitalk.bysmax.com/tickets/${order.id}`} size={128} />
              </div>
            </div>

            {!order.paid && (
              <>

                {/* Instrucciones de pago */}
                <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Instrucciones de Pago</h2>

                  <div className="space-y-4 text-gray-300">
                    {order.payment_method === 'transferencia' && (
                      <div className="space-y-2">
                        <p>Para completar tu compra, realiza una transferencia con los siguientes datos:</p>
                        <div className="bg-blue-900/30 p-4 rounded-lg">
                          <p><span className="font-medium">Banco:</span> Santander</p>
                          <p><span className="font-medium">Titular:</span> Alexandra Centurión.</p>
                          <div className="flex items-center gap-2">
                            <p><span className="font-medium">Tarjeta:</span> 5579083041559523</p>
                            <button
                              onClick={() => navigator.clipboard.writeText('5579083041559523')}
                              className="px-2 py-1 text-sm bg-tecmitalk-accent/20 hover:bg-tecmitalk-accent/30 rounded-md transition-colors"
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <p><span className="font-medium">Concepto:</span> Orden #{order.id}</p>
                            <button
                              onClick={() => navigator.clipboard.writeText(`${order.id}`)}
                              className="px-2 py-1 text-sm bg-tecmitalk-accent/20 hover:bg-tecmitalk-accent/30 rounded-md transition-colors"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>
                        <p className="text-sm">Una vez realizada la transferencia, envía el comprobante por WhatsApp.</p>
                      </div>
                    )}

                    {order.payment_method === 'efectivo' && (
                      <div className="space-y-2">
                        <p>Para completar tu compra en efectivo:</p>
                        <div className="bg-blue-900/30 p-4 rounded-lg">
                          <p>Acude a nuestras oficinas ubicadas en:</p>
                          <p className="font-medium">Av. Universidad 123, Col. Centro</p>
                          <p>Horario: Lunes a Viernes de 9:00 AM a 5:00 PM</p>
                          <p>Menciona tu número de orden: #{order.id}</p>
                        </div>
                      </div>
                    )}

                    <p className="mt-4">
                      Para cualquier duda,{' '}
                      <a
                        href="https://wa.me/5218180861794"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tecmitalk-accent hover:underline"
                      >
                        contáctanos por WhatsApp
                      </a>
                    </p>
                  </div>
                </div>
              </>
            )}
            <div>

            </div>


            <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Información de la Orden</h2>

              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span>Número de orden:</span>
                  <span className="text-white font-mono">#{order.id}</span>
                </div>

                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estado de pago:</span>
                  <span className={`capitalize ${order.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.paid ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Método de pago:</span>
                  <span className="text-white capitalize">{order.payment_method.replace('_', ' ')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-white font-bold">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Información del Cliente</h2>

              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span className="text-white">{order.customer_name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Correo electrónico:</span>
                  <span className="text-white">{order.customer_email}</span>
                </div>

                <div className="flex justify-between">
                  <span>Teléfono:</span>
                  <span className="text-white">{order.customer_phone}</span>
                </div>
              </div>
            </div>

            {/* Detalles de los tickets */}
            <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Detalles de los Tickets</h2>

              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="border-b border-blue-400/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{item.tickets?.name || 'Ticket'}</span>
                      <span className="text-white">{item.quantity}x ${item.unit_price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.tickets?.description || ''}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">${(item.quantity * item.unit_price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Talleres seleccionados */}
            {workshopDetails.length > 0 && (
              <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Talleres Seleccionados</h2>
                <div className="space-y-4">
                  {workshopDetails.map((workshop) => (
                    <div key={workshop.id} className="border-b border-blue-400/10 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">{workshop.workshops?.name || 'Taller'}</span>
                        <span className="text-white">{workshop.quantity}x</span>
                      </div>
                      <p className="text-gray-400 text-sm">{workshop.workshops?.description_workshop || ''}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        <span className="text-tecmitalk-accent">Instructor:</span> {workshop.workshops?.leadear_worshop || 'Por confirmar'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visitas empresariales seleccionadas */}
            {corporateVisitDetails.length > 0 && (
              <div className="bg-blue-900/10 border border-blue-400/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Visitas Empresariales</h2>
                <div className="space-y-4">
                  {corporateVisitDetails.map((visit) => (
                    <div key={visit.id} className="border-b border-blue-400/10 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">{visit.corporate_visits?.name || 'Visita Empresarial'}</span>
                        <span className="text-white">{visit.quantity}x</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{visit.corporate_visits?.description || 'Detalles de la visita empresarial'}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {visit.corporate_visits?.starting_time && (
                          <div className="bg-blue-900/30 px-3 py-1.5 rounded-md inline-flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-tecmitalk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-white text-sm">
                              {new Date(`1970-01-01T${visit.corporate_visits.starting_time}`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                        {visit.corporate_visits?.location && (
                          <div className="bg-blue-900/30 px-3 py-1.5 rounded-md inline-flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-tecmitalk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-white text-sm">{visit.corporate_visits.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay talleres ni visitas */}
            {!isLoading && workshopDetails.length === 0 && corporateVisitDetails.length === 0 && 
              orderItems.some(item => 
                item.tickets?.name === 'Boleto VIP' || item.tickets?.name === 'Boleto Priority'
              ) && (
              <div className="bg-blue-900/10 border border-yellow-400/20 rounded-lg p-6">
                <p className="text-yellow-400 text-center">
                  No has seleccionado talleres o visitas empresariales. 
                  Contacta con nosotros para completar tu selección.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
