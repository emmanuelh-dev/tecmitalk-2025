export default function TecmiTalkSchedule() {
    // Array de actividades de la mañana
    const morningSchedule = [
      { time: "8:00 AM - 9:00 AM", activity: "Open Doors y Registro" },
      { time: "9:10 AM", activity: "Cierre de Puertas" },
      { time: "9:00 AM", activity: "Arranque de TecmiTalk" },
      { time: "9:15 AM - 10:00 AM", activity: "Conferencia 1" },
      { time: "10:00 AM - 10:45 AM", activity: "Conferencia 2" },
      { time: "10:45 AM - 11:30 AM", activity: "Conferencia 3" },
      { time: "11:30 AM", activity: "Open Doors" },
      { time: "11:45 AM - 12:45 PM", activity: "Taller Magistral" },
    ]
  
    // Array de actividades de la tarde
    const afternoonSchedule = [
      { time: "12:15 PM - 1:30 PM", activity: "Taller Preferencial" },
      { time: "1:30 PM - 2:45 PM", activity: "Descanso para comida" },
      { time: "2:30 PM", activity: "Open Doors" },
      { time: "3:00 PM", activity: "Cierre de Puertas" },
      { time: "3:00 PM - 3:45 PM", activity: "Conferencia 4" },
      { time: "3:45 PM - 4:30 PM", activity: "Conferencia 5" },
      { time: "4:30 PM - 5:10 PM", activity: "Conferencia 6" },
      { time: "5:10 PM - 6:00 PM", activity: "Conferencia 7" },
    ]
  
    return (
      <div className="bg-primary p-6 md:p-10 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full translate-x-1/2 translate-y-1/2"></div>
  
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">TECMITALK</h1>
          <h2 className="text-3xl md:text-4xl font-serif italic text-white">Itinerario</h2>
        </div>
  
        {/* Subheaders */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 max-w-7xl mx-auto">
          <div className="bg-black text-white text-2xl md:text-3xl font-bold p-3 text-center w-full">¡Nos vemos mañana!</div>
          <div className="bg-black text-white text-xl md:text-2xl font-bold p-3 text-center w-full">Recuerda llegar puntual</div>
        </div>
  
        {/* Schedule Tables */}
        <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto">
          {/* Morning Schedule */}
          <div className="flex-1">
            <div className="grid grid-cols-2 text-center bg-teal-700 text-white font-bold">
              <div className="p-2 border border-teal-600">HORA</div>
              <div className="p-2 border border-teal-600">ACTIVIDAD</div>
            </div>
  
            <div className="grid grid-cols-2 bg-white">
              {morningSchedule.map((item, index) => (
                <>
                  <div key={`time-${index}`} className="p-2 border border-gray-200 text-center">
                    {item.time}
                  </div>
                  <div key={`activity-${index}`} className="p-2 border border-gray-200 font-medium">
                    {item.activity}
                  </div>
                </>
              ))}
            </div>
          </div>
  
          {/* Afternoon Schedule */}
          <div className="flex-1">
            <div className="grid grid-cols-2 text-center bg-teal-700 text-white font-bold">
              <div className="p-2 border border-teal-600">HORA</div>
              <div className="p-2 border border-teal-600">ACTIVIDAD</div>
            </div>
  
            <div className="grid grid-cols-2 bg-white">
              {afternoonSchedule.map((item, index) => (
                <>
                  <div key={`afternoon-time-${index}`} className="p-2 border border-gray-200 text-center">
                    {item.time}
                  </div>
                  <div key={`afternoon-activity-${index}`} className="p-2 border border-gray-200 font-medium">
                    {item.activity}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white text-2xl md:text-3xl font-serif italic">¡Síguenos en redes sociales!</p>
        </div>
      </div>
    )
  }
  