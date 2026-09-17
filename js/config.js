/* ==========================================================================
   CONFIGURACIÓN DEL NEGOCIO — Champions People
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar:
   nombre, WhatsApp, dirección, horarios, servicios, precios, galería,
   redes sociales y testimonios.
   ========================================================================== */

const BUSINESS = {
  /* --- Identidad ------------------------------------------------------- */
  name: "Champions People",
  tagline: "Canchas de fútbol · Zonas VIP · Bar y comida",
  logo: "img/logo.jpg",
  city: "Cúcuta",

  /* --- WhatsApp -------------------------------------------------------- */
  // Número en formato internacional SIN "+", espacios ni guiones.
  // Colombia = 57 + número de 10 dígitos.
  whatsappNumber: "573128466630",
  // Número tal como se muestra al público.
  whatsappDisplay: "312 846 6630",
  // Mensaje del botón flotante y de los enlaces directos.
  whatsappGreeting: "Hola, me gustaría consultar disponibilidad para reservar una cancha.",

  /* --- Contacto -------------------------------------------------------- */
  phoneDisplay: "312 846 6630",
  phoneTel: "+573128466630",
  address: "Cl. 5 Nte. #3E-47, Ceiba II",
  addressCity: "Cúcuta, Norte de Santander",
  // Se usa para el mapa embebido y el enlace "Cómo llegar".
  mapsQuery: "Cl. 5 Nte. #3E-47, Ceiba II, Cúcuta",

  /* --- Horarios -------------------------------------------------------- */
  hours: [
    { days: "Lunes a Domingo", time: "6:00 PM – 11:00 PM" },
  ],

  /* --- Descuento / convenio -------------------------------------------
     Se muestra como banner en Servicios y como casilla en el formulario.
     enabled: false lo oculta por completo.                                */
  membership: {
    enabled: true,
    partner: "Fitness People",
    title: "¿Eres afiliado de Fitness People?",
    text: "Tienes descuento exclusivo en tus reservas. Indícalo al reservar y te lo aplicamos por WhatsApp.",
    checkboxLabel: "Soy afiliado de Fitness People (descuento exclusivo)",
  },

  /* --- Redes sociales --------------------------------------------------
     Deja el campo vacío ("") para ocultar la red que no uses.             */
  social: {
    instagram: "https://www.instagram.com/champions.people/",
    facebook: "",
    tiktok: "",
  },

  /* --- Servicios -------------------------------------------------------
     icon:    "field" | "vip" | "food" | "trophy"
     pricing: lista de franjas con su precio. Puedes agregar más franjas
              (ej. horario diurno) y cada una se mostrará en la tarjeta.
              Deja pricing: [] para mostrar "Consultar precio".            */
  services: [
    {
      id: "cancha-7v7",
      name: "Cancha de fútbol 7 vs 7",
      description:
        "Grama sintética profesional e iluminación LED para partidos de hasta 14 jugadores. Ideal para torneos y encuentros entre amigos.",
      pricing: [
        { schedule: "6:00 PM – 11:00 PM", price: "$130.000", unit: "/ hora" },
      ],
      icon: "field",
      featured: true,
      capacityLabel: "Hasta 14 jugadores",
    },
    {
      id: "cancha-6v6",
      name: "Cancha de fútbol 6 vs 6",
      description:
        "Espacio perfecto para partidos rápidos y dinámicos. Superficie de alta calidad y ambiente de estadio.",
      pricing: [
        { schedule: "6:00 PM – 11:00 PM", price: "$110.000", unit: "/ hora" },
      ],
      icon: "field",
      capacityLabel: "Hasta 12 jugadores",
    },
    {
      id: "zona-vip",
      name: "Zona VIP con aire acondicionado",
      description:
        "Área privada climatizada con vista a la cancha, sofás y pantallas. Perfecta para celebraciones y eventos.",
      pricing: [],
      icon: "vip",
      capacityLabel: "Grupos y eventos",
    },
    {
      id: "bar-comida",
      name: "Bar y comida",
      description:
        "Hamburguesas, snacks, bebidas frías y más para disfrutar antes, durante y después del partido.",
      pricing: [],
      icon: "food",
      capacityLabel: "Para todos los asistentes",
    },
  ],

  /* --- Formulario de reserva ------------------------------------------ */
  booking: {
    // Franjas horarias disponibles en el selector de hora (formato 24h).
    firstHour: 18,  // 6:00 PM  (primera hora de inicio)
    lastHour: 22,   // 10:00 PM (última hora de inicio; el cierre es a las 11:00 PM)
    maxPeople: 30,
  },

  /* --- Galería -------------------------------------------------------- */
  gallery: [
    { src: "img/zona-vip.png", alt: "Zona VIP con techo de grama y camisetas de equipos", size: "wide" },
    { src: "img/hero-jugador.png", alt: "Jugador de Champions People pateando el balón" },
    { src: "img/servicios-info.png", alt: "Servicios: canchas 7 vs 7, 6 vs 6, zonas VIP y bar" },
  ],

  /* --- Testimonios ----------------------------------------------------
     DEMO: contenido ficticio. Reemplazar por reseñas reales o dejar el
     array vacío ([]) para ocultar la sección.                             */
  testimonials: [
    {
      name: "Andrés M.",
      role: "Capitán de equipo amateur",
      text: "Reservé por WhatsApp en dos minutos y la cancha estaba lista cuando llegamos. La iluminación es de otro nivel.",
      rating: 5,
    },
    {
      name: "Laura G.",
      role: "Cumpleaños en zona VIP",
      text: "Celebramos el cumpleaños de mi hijo en la zona VIP. Aire acondicionado, buena comida y atención de 10.",
      rating: 5,
    },
    {
      name: "Camilo R.",
      role: "Torneo empresarial",
      text: "Organizamos un torneo de la empresa y todo salió perfecto. Respuesta rápida y muy buena organización.",
      rating: 5,
    },
  ],
};

/* Construye el enlace wa.me con un mensaje ya codificado. */
function buildWhatsAppLink(message) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
