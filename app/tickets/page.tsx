'use client';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TicketType = {
  id: number;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  type: 'general' | 'vip' | 'priority';
  quantity_available: number;
};

type WorkshopType = {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  current_attendees: number;
};

type CorporateType = {
  id: number;
  name: string;
  capacity: number;
  current_attendees: number;
  finish_time: string;
  starting_time: string;
}

type PaymentMethod = 'efectivo' | 'transferencia';

export default function TicketsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: '',
    quantity: 1,
    paymentMethod: '' as PaymentMethod,
    selectedWorkshop: '',
    selectedCorporateVisit: '',
  });
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [availableTickets, setAvailableTickets] = useState<TicketType[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopType[]>([]);
  const [corporate_visit, setCorporates] = useState<CorporateType[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [loadingCorporates, setLoadingCorporates] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        // 1. Cargar tickets primero
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });
  
        if (ticketsError || !ticketsData) {
          console.error("Error tickets:", ticketsError);
          throw new Error("No se pudieron cargar los tickets. Intenta recargar la página.");
        }
  
        if (ticketsData.length === 0) {
          setAvailableTickets([]);
          throw new Error("Actualmente no hay tickets disponibles.");
        }
  
        setAvailableTickets(ticketsData.map(t => ({ ...t, benefits: t.benefits || [] })));
  
        // 2. Solo cargar talleres si hay tickets VIP/Priority
        const needsWorkshops = ticketsData.some(t => t.type === 'vip' || t.type === 'priority');
        
        if (needsWorkshops) {
          const { data: workshopsData, error: workshopsError } = await supabase
            .from('workshops')
            .select('*')
            .gt('capacity', 0)
            .order('name');
  
          if (workshopsError) {
            console.error("Error talleres:", workshopsError);
            setError(prev => prev + " (Advertencia: Talleres no disponibles)");
          } else {
            setWorkshops(workshopsData || []);
          }

          const { data: corporateData, error: corporateError } = await supabase
            .from('corporate_visit')
            .select('*')
            .gt('capacity', 0)
            .order('starting_time');
  
          if (corporateError) {
            console.error("Error visitas empresariales:", corporateError);
            setError(prev => prev + " (Advertencia: Visitas empresariales no disponibles)");
          } else {
            setCorporates(corporateData || []);
          }
        }
  
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        console.error("Error carga datos:", err);
      } finally {
        setLoadingTickets(false);
        setLoadingWorkshops(false);
        setLoadingCorporates(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nombre requerido';
    if (!formData.email.trim()) errors.email = 'Correo requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Correo inválido';
    if (!formData.phone.trim()) errors.phone = 'Teléfono requerido';
    if (!/^[\d\s+\-\(\)]{10,}$/.test(formData.phone)) errors.phone = 'Mínimo 10 dígitos';
    if (!formData.ticketType) errors.ticketType = 'Selecciona un boleto';
    if (!formData.paymentMethod) errors.paymentMethod = 'Selecciona método de pago';
    if (formData.quantity < 1 || formData.quantity > 10) errors.quantity = '1-10 boletos';
    
    if (selectedTicket && (selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && !formData.selectedWorkshop) {
      errors.selectedWorkshop = 'Selecciona un taller';
    }
    
    if (selectedTicket && (selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && !formData.selectedCorporateVisit) {
      errors.selectedCorporateVisit = 'Selecciona una visita empresarial';
    }
    
    setFormErrors(errors);
  }, [formData, selectedTicket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : 
              type === 'radio' ? value as PaymentMethod : 
              value
    }));

    if (name === 'ticketType') {
      const ticket = availableTickets.find(t => t.id.toString() === value) || null;
      setSelectedTicket(ticket);
      if (ticket?.type !== 'vip' && ticket?.type !== 'priority') {
        setFormData(prev => ({ ...prev, selectedWorkshop: '', selectedCorporateVisit: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (Object.keys(formErrors).length > 0 || !selectedTicket) {
      setError('Por favor completa todos los campos requeridos correctamente');
      setLoading(false);
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('El número de teléfono debe contener al menos 10 dígitos');
      setLoading(false);
      return;
    }

    if (selectedTicket.quantity_available < formData.quantity) {
      setError(`No hay suficientes boletos disponibles. Solo quedan ${selectedTicket.quantity_available}`);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const totalAmount = selectedTicket.price * formData.quantity;
      const now = new Date().toISOString();

      // 1. Insertar orden principal
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          payment_method: formData.paymentMethod,
          total_amount: totalAmount,
          created_at: now
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insertar items de la orden
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          ticket_id: selectedTicket.id,
          quantity: formData.quantity,
          unit_price: selectedTicket.price,
          created_at: now
        });

      if (itemError) {
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemError;
      }

      // 3. Insertar taller si es VIP o Priority
      if ((selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && formData.selectedWorkshop) {
        const { error: workshopError } = await supabase
          .from('order_workshops')
          .insert({
            order_id: order.id,
            workshop_id: parseInt(formData.selectedWorkshop),
            quantity: formData.quantity
          });

        if (workshopError) {
          await supabase.from('orders').delete().eq('id', order.id);
          throw workshopError;
        }

        // Actualizar contador de asistentes al taller
        const { data: workshopOrder, error: workshopOrderError } = await supabase
          .from('order_workshops')
          .select('quantity')
          .eq('order_id', order.id)
          .eq('workshop_id', formData.selectedWorkshop)
          .single();

        if (workshopOrderError || !workshopOrder) {
          console.error('Error al verificar la compra de boletos:', workshopOrderError);
          throw new Error('No se pudo confirmar la reserva en el taller');
        }

        const { error: updateWorkshopError } = await supabase.rpc('increment_workshop_attendees', {
          workshop_id: parseInt(formData.selectedWorkshop),
          increment_value: workshopOrder.quantity
        });

        if (updateWorkshopError) {
          console.error('Error al actualizar asistentes:', updateWorkshopError);
          throw updateWorkshopError;
        }
      }

 // 4. Insertar visita empresarial si es VIP o Priority
if ((selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && formData.selectedCorporateVisit) {
  try {
    // Primero actualizamos el contador de asistentes 
    const { error: updateCorporateError } = await supabase.rpc('adjust_corporate_visit_attendees', {
      p_visit_id: parseInt(formData.selectedCorporateVisit), // Asegurar que es bigint
      p_increment: formData.quantity // Cambiado de increment_value a adjustment
    });

    if (updateCorporateError) {
      throw new Error(`Error al actualizar asistentes: ${updateCorporateError.message}`);
    }

    // Luego insertamos el registro de la visita
    const { error: corporateError } = await supabase
      .from('order_corporate_visits')
      .insert({
        order_id: order.id,
        corporate_visit_id: parseInt(formData.selectedCorporateVisit),
        quantity: formData.quantity
      });

    if (corporateError) {
      // Si falla la inserción, revertimos el cambio en los asistentes
      await supabase.rpc('adjust_corporate_visit_attendees', {
        p_visit_id: parseInt(formData.selectedCorporateVisit),
        p_increment: -formData.quantity
      });
      
      await supabase.from('orders').delete().eq('id', order.id);
      throw corporateError;
    }

  } catch (error) {
    console.error('Error en proceso de visita empresarial:', error);
    throw error; // Re-lanzamos el error para manejo superior
  }
}
      // 5. Actualizar cantidad disponible de tickets
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ quantity_available: selectedTicket.quantity_available - formData.quantity })
        .eq('id', selectedTicket.id);

      if (updateError) {
        await supabase.from('orders').delete().eq('id', order.id);
        throw updateError;
      }

      // 6. Redirigir a confirmación
      router.push(
        `/confirmacion?order_id=${order.id}` +
        `&amount=${totalAmount.toFixed(2)}` +
        `&tickets=${formData.quantity}` +
        `&ticket_name=${encodeURIComponent(selectedTicket.name)}` +
        `&payment_method=${formData.paymentMethod}`
      );
      
    } catch (err: any) {
      console.error('Error al procesar la orden:', err);
      setError(err.message || 'Ocurrió un error al procesar tu compra. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const totalAmount = selectedTicket ? (selectedTicket.price * formData.quantity).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-[#14095D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl border border-tecmitalk-accent/30 p-6 md:p-8">
        <Link href="/" className="inline-flex items-center text-tecmitalk-accent hover:text-tecmitalk-accent/80 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">Adquiere tus boletos</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {loadingTickets || loadingWorkshops ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando datos...
            </div>
          </div>
        ) : availableTickets.length === 0 ? (
          <div className="text-center py-12 text-white">
            No hay tickets disponibles en este momento
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Tus datos</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-white/5 border ${formErrors.name ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                  {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                  {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-white/5 border ${formErrors.phone ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    placeholder="+52 55 1234 5678"
                    required
                    pattern="[\d\s+\-\(\)]{10,}"
                    title="Debe contener al menos 10 dígitos"
                  />
                  {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="ticketType" className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de boleto *
                  </label>
                  <select
                    id="ticketType"
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-blue-900/20 border ${formErrors.ticketType ? 'border-red-500' : 'border-blue-400/30'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    {availableTickets.map(ticket => (
                      <option key={ticket.id} value={ticket.id} className="bg-[#14095D]">
                        {ticket.name} - ${ticket.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {formErrors.ticketType && <p className="text-red-400 text-sm mt-1">{formErrors.ticketType}</p>}
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad de boletos *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="10"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-white/5 border ${formErrors.quantity ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    required
                  />
                  {formErrors.quantity && <p className="text-red-400 text-sm mt-1">{formErrors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Método de pago *
                  </label>
                  <div className="space-y-3">
                    {['efectivo', 'transferencia'].map(method => (
                      <label key={method} className={`flex items-center space-x-3 p-3 bg-white/5 border ${formErrors.paymentMethod ? 'border-red-500' : 'border-white/20'} rounded-lg cursor-pointer hover:bg-white/10`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-tecmitalk-accent focus:ring-tecmitalk-accent"
                          required
                        />
                        <span className="text-white capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.paymentMethod && <p className="text-red-400 text-sm mt-1">{formErrors.paymentMethod}</p>}
                </div>
              </div>

              {/* Selector de taller para boletos VIP y Priority */}
              {selectedTicket && (selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && (
                <div>
                  <label htmlFor="selectedWorkshop" className="block text-sm font-medium text-gray-300 mb-2">
                    Selecciona tu taller *
                  </label>
                  <select
                    id="selectedWorkshop"
                    name="selectedWorkshop"
                    value={formData.selectedWorkshop}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-blue-900/20 border ${formErrors.selectedWorkshop ? 'border-red-500' : 'border-blue-400/30'} rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
                    required
                  >
                    <option value="">Selecciona un taller</option>
                    {workshops.map(workshop => (
                      <option key={workshop.id} value={workshop.id} className="bg-[#14095D]">
                        {workshop.name} (Capacidad: {workshop.capacity - workshop.current_attendees} disponibles)
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedWorkshop && <p className="text-red-400 text-sm mt-1">{formErrors.selectedWorkshop}</p>}
                </div>
              )}
{/* Selector de visita empresarial para boletos VIP y Priority */}
{selectedTicket && (selectedTicket.type === 'vip' || selectedTicket.type === 'priority') && (
  <div>
    <label htmlFor="selectedCorporateVisit" className="block text-sm font-medium text-gray-300 mb-2">
      Selecciona una visita empresarial *
    </label>
    <select
      id="selectedCorporateVisit"
      name="selectedCorporateVisit"
      value={formData.selectedCorporateVisit}
      onChange={handleInputChange}
      className={`w-full p-3 bg-blue-900/20 border ${
        formErrors.selectedCorporateVisit ? 'border-red-500' : 'border-blue-400/30'
      } rounded-lg text-white focus:ring-2 focus:ring-tecmitalk-accent focus:border-transparent`}
      required
    >
      <option value="">Selecciona una visita</option>
      {corporate_visit.map(visit => (
        <option key={visit.id} value={visit.id} className="bg-[#14095D]">
          {visit.name} (
            {formatTime(visit.starting_time)} - {formatTime(visit.finish_time)}
          ) - {visit.capacity - visit.current_attendees} lugares disponibles
        </option>
      ))}
    </select>
    {formErrors.selectedCorporateVisit && (
      <p className="text-red-400 text-sm mt-1">{formErrors.selectedCorporateVisit}</p>
    )}
  </div>
)}
            </div>

            {selectedTicket && (
              <div className="p-6 bg-blue-900/10 border border-blue-400/20 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-blue-300">Resumen de compra</h3>
                    <p className="text-white">{selectedTicket.name}</p>
                  </div>
                  <span className="text-2xl font-bold text-white">${totalAmount}</span>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><span className="font-medium">{formData.quantity}x</span> {selectedTicket.name} (${selectedTicket.price.toFixed(2)} c/u)</p>
                  <p className="text-gray-400">{selectedTicket.description}</p>
                  <ul className="list-disc list-inside mt-2">
                    {selectedTicket.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                  
                  {formData.selectedWorkshop && (
                    <p className="pt-2">
                      Taller seleccionado: <span className="font-medium">
                        {workshops.find(w => w.id.toString() === formData.selectedWorkshop)?.name}
                      </span>
                    </p>
                  )}
                  
                  {formData.selectedCorporateVisit && (
                    <p className="pt-2">
                      Visita empresarial: <span className="font-medium">
                        {corporate_visit.find(v => v.id.toString() === formData.selectedCorporateVisit)?.name}
                      </span>
                    </p>
                  )}
                  
                  {formData.paymentMethod && (
                    <p className="pt-2">
                      Método de pago: <span className="font-medium capitalize">{formData.paymentMethod}</span>
                    </p>
                  )}
                  <p className="pt-4">Recibirás instrucciones de pago por correo electrónico.</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedTicket || Object.keys(formErrors).length > 0}
              className="w-full py-4 bg-tecmitalk-accent hover:bg-tecmitalk-accent/90 text-white font-bold text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                `Reservar boletos $${totalAmount}`
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}