# Champions People — Landing page con reserva por WhatsApp

Landing page estática (HTML + CSS + JavaScript, sin dependencias ni backend) para
captar reservas de canchas de fútbol, zonas VIP y bar directamente por WhatsApp.

## Cómo abrirla

Abre `index.html` en el navegador o súbela a cualquier hosting estático
(Netlify, Vercel, GitHub Pages, cPanel, etc.). No requiere instalación.

## Estructura

```
├── index.html        Página principal
├── privacidad.html   Política de privacidad
├── css/styles.css    Estilos (paleta, componentes, responsive)
├── js/config.js      ⭐ DATOS DEL NEGOCIO — el único archivo que debes editar
├── js/main.js        Lógica: menú, animaciones, formulario → WhatsApp
└── img/              Logo y fotografías
```

## Dónde modificar cada dato — `js/config.js`

| Qué cambiar            | Campo en `BUSINESS`                       |
|------------------------|-------------------------------------------|
| Nombre del negocio     | `name`, `tagline`, `city`                 |
| Logo                   | `logo` (y el `<img>` del header en `index.html`) |
| **Número de WhatsApp** | `whatsappNumber` → formato `57XXXXXXXXXX` (sin `+`, sin espacios) |
| WhatsApp visible       | `whatsappDisplay`                         |
| Mensaje del botón flotante | `whatsappGreeting`                    |
| Teléfono               | `phoneDisplay`, `phoneTel`                |
| Dirección y mapa       | `address`, `addressCity`, `mapsQuery`     |
| Horarios               | `hours` (array de `{ days, time }`)       |
| Descuento afiliados    | `membership` (`enabled`, `partner`, textos del banner y la casilla) |
| Redes sociales         | `social.instagram`, `social.facebook`, `social.tiktok` (vacío = se oculta) |
| Servicios y precios    | `services` → `name`, `description`, `pricing`, `icon`, `featured` |
| Franjas horarias del formulario | `booking.firstHour`, `booking.lastHour`, `booking.maxPeople` |
| Fotos de la galería    | `gallery` (array de `{ src, alt, size }`) |
| Testimonios            | `testimonials` — actualmente DEMO; `[]` oculta la sección |

### Precios por franja horaria
Cada servicio tiene un array `pricing`. Cada elemento es una franja con su precio:

```js
pricing: [
  { schedule: "6:00 PM – 11:00 PM", price: "$130.000", unit: "/ hora" },
  // Agrega más franjas si el precio cambia según la hora:
  // { schedule: "8:00 AM – 6:00 PM", price: "$90.000", unit: "/ hora" },
],
```

Si `pricing` está vacío (`[]`) la tarjeta muestra "Consultar precio".

### Descuento para afiliados
`membership` controla el banner de la sección Servicios y la casilla
"Soy afiliado de Fitness People" del formulario. Si el usuario la marca, el
mensaje de WhatsApp incluye la línea `Afiliado Fitness People: Sí`.
`enabled: false` oculta ambos.

### Imágenes
Coloca las fotos en `img/` y referencia su ruta en `gallery`. La imagen del hero
está en `index.html` (`img/hero-jugador.png`) y la imagen de Open Graph en las
metaetiquetas del `<head>`.

### Textos
Los títulos y párrafos de cada sección (hero, pasos, confianza) se editan
directamente en `index.html`. Los metadatos SEO (title, description, Open Graph
y la URL canónica) están al inicio del `<head>`.

## Flujo de reserva

1. El usuario completa el formulario (nombre, teléfono, servicio, fecha, hora,
   personas, comentarios).
2. `js/main.js` valida los campos y construye el mensaje:

   ```
   Hola, quiero realizar una reserva.

   Nombre: Juan Pérez
   Teléfono: 3001234567
   Servicio: Cancha de fútbol 7 vs 7
   Fecha: 20/09/2026
   Hora: 7:00 PM
   Personas: 10
   Afiliado Fitness People: Sí (descuento exclusivo)
   Comentarios: Quisiera reservar durante 2 horas.

   ¿Me confirman disponibilidad? ¡Gracias!
   ```

3. Se abre `https://wa.me/<whatsappNumber>?text=<mensaje>` en una pestaña nueva.
4. El negocio recibe la solicitud en su WhatsApp.

## Contenido marcado como DEMO

- `testimonials` (opiniones de clientes).
- URL canónica y `og:url` en `index.html` (`https://www.championspeople.com/`).

Reemplázalos antes de publicar la página.
