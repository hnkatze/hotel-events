# Sistema de Gestión de Eventos para Hotel 🏨

## 📋 Descripción del Proyecto

**Hotel Events System** es una aplicación web moderna desarrollada para la gestión completa de eventos en un hotel de 5 salones. El sistema permite administrar reservas, clientes, recursos, personal y toda la logística operativa necesaria para eventos corporativos y sociales.

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**
- **Frontend**: Next.js 15.3.5 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS 3.3.0 + Shadcn/ui
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth (Google OAuth)
- **Almacenamiento**: Firebase Storage
- **Runtime**: Node.js v23.9.0

### **Estructura del Proyecto**
```
hotel-events/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── loading.tsx        # Loading global
│   │   ├── globals.css        # Estilos globales
│   │   ├── calendar/          # Vista de calendario
│   │   │   └── page.tsx
│   │   └── events/           # Gestión de eventos
│   │       ├── [id]/         # Detalles de evento
│   │       │   └── page.tsx
│   │       └── new/          # Crear evento
│   │           └── page.tsx
│   ├── components/           # Componentes reutilizables
│   │   ├── auth-guard.tsx    # Protección de rutas
│   │   ├── user-menu.tsx     # Menú de usuario
│   │   ├── calendar-widget.tsx
│   │   └── ui/               # Componentes UI (Shadcn)
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── contexts/             # Context API
│   │   └── auth-context.tsx  # Gestión de autenticación
│   ├── hooks/                # Custom hooks
│   │   └── use-events.ts     # Hook para eventos
│   └── lib/                  # Librerías y utilidades
│       ├── firebase.ts       # Configuración Firebase
│       └── utils.ts          # Utilidades generales
├── .env.local               # Variables de entorno
├── components.json          # Configuración Shadcn
├── tailwind.config.ts       # Configuración Tailwind
├── postcss.config.mjs       # Configuración PostCSS
├── next.config.js           # Configuración Next.js
└── package.json             # Dependencias
```

---

## 🎯 Funcionalidades Principales

### **1. Dashboard Principal** (`/`)
- **Vista general**: Estadísticas de eventos activos
- **Métricas**: Total eventos, ingresos, ocupación de salones
- **Estado de salones**: Visualización en tiempo real de disponibilidad
- **Lista de eventos**: Eventos recientes con estados y acciones rápidas
- **Filtros y búsqueda**: Para encontrar eventos específicos

### **2. Gestión de Eventos** (`/events/new`)
**Formulario completo de 8 secciones:**

#### 📅 **Información Básica**
- Nombre del evento
- Tipo (Corporativo, Social, Conferencia, etc.)
- Fecha y horarios (inicio, fin, setup, desmontaje)
- Estado (Pendiente, Confirmado, Cancelado, Finalizado)

#### 👤 **Cliente/Contratante**
- Datos personales (nombre, cargo, empresa)
- Información de contacto (teléfono, email)
- Requisitos especiales (accesibilidad, restricciones alimentarias)

#### 🏛️ **Salón y Espacios**
- **5 Salones disponibles**:
  - Salón Diamante (120 personas) - $15,000
  - Salón Cristal (180 personas) - $20,000
  - Salón Esmeralda (100 personas) - $12,000
  - Salón Rubí (80 personas) - $10,000
  - Salón Zafiro (200 personas) - $25,000
- Configuraciones: Teatro, Banquete, Coctel, Aula, U-Shape
- Capacidad mínima y máxima
- Áreas adicionales (vestíbulo, terraza, etc.)

#### 🍽️ **Servicios F&B (Food & Beverage)**
- Coffee Break Mañana/Tarde
- Desayuno Continental/Americano
- Almuerzo/Cena (Buffet/Servido)
- Coctel de Bienvenida/Cierre
- Servicios personalizados

#### 🔧 **Equipamiento y Recursos**
- Proyector y pantallas
- Sistema de audio y micrófonos
- Equipos de iluminación
- Wi-Fi reforzado
- Material de escritorio (flipchart, pizarra)
- Tarima y atril

#### 👥 **Personal Asignado**
- Coordinador principal (Ana García, Carlos López, María Rodríguez)
- Camareros y bartenders (cantidad)
- Personal de seguridad
- Supervisor de cocina (Chef Roberto Martín, Chef Isabella Torres)

#### 📋 **Logística Operativa**
- Proveedores externos (DJ, florista, decoración)
- Instrucciones especiales de setup
- Notas para el personal
- Detalles de coordinación

#### ⚖️ **Aspectos Legales y Financieros**
- Contrato firmado (checkbox)
- Seguro del evento
- Permisos municipales
- Fecha de contrato
- Costo total y depósito
- Método de pago

### **3. Vista de Calendario** (`/calendar`)
- **Calendario mensual**: Visualización de eventos por fechas
- **Filtros por**:
  - Tipo de evento
  - Estado
  - Salón
  - Cliente
- **Vista de eventos**: Lista detallada con información clave
- **Navegación**: Por meses y años

### **4. Detalles de Evento** (`/events/[id]`)
- **Información completa**: Todos los datos del evento
- **Timeline**: Horarios de setup, evento y desmontaje
- **Status visual**: Badges de estado con colores
- **Acciones**: Editar, imprimir, contactar cliente
- **Datos organizados**: Por categorías (cliente, venue, servicios, etc.)

---

## 🔐 Sistema de Autenticación

### **Firebase Auth + Google OAuth**
- **Autenticación social**: Login con cuenta Google
- **Protección de rutas**: AuthGuard componente
- **Gestión de sesión**: Context API para estado global
- **UI de login**: Diseño profesional con branding del hotel

### **Funcionalidades de Auth**
- Login/logout automático
- Persistencia de sesión
- Avatar y datos de usuario
- Menú de usuario con opciones

---

## 💾 Base de Datos (Firebase Firestore)

### **Colección: `events`**
```typescript
interface Event {
  id: string
  userId: string              // ID del usuario creador
  name: string                // Nombre del evento
  type: string                // Tipo de evento
  date: string                // Fecha del evento
  startTime: string           // Hora de inicio
  endTime: string             // Hora de fin
  setupTime?: string          // Hora de setup
  teardownTime?: string       // Hora de desmontaje
  status: "pending" | "confirmed" | "cancelled" | "finished"
  
  // Cliente
  client: {
    name: string
    position?: string
    company?: string
    phone: string
    email: string
    specialRequirements?: string
  }
  
  // Venue
  venue: {
    salon: string
    capacity: number
    configuration: string
    attendeesMin?: number
    attendeesMax: number
    additionalAreas?: string[]
  }
  
  // Servicios y equipamiento
  services: string[]          // Lista de servicios F&B
  equipment: string[]         // Lista de equipamiento
  
  // Personal
  staff: {
    coordinator: string
    waiters: number
    security: number
    kitchenSupervisor: string
  }
  
  // Logística
  logistics: {
    externalProviders?: string
    setupInstructions?: string
    specialNotes?: string
  }
  
  // Financiero
  financial: {
    totalCost: number
    deposit: number
    paymentMethod: string
    contractSigned: boolean
    insurance: boolean
    permits: boolean
    contractDate?: string
  }
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## 🎨 Diseño y UX

### **Design System**
- **Framework**: Shadcn/ui + Radix UI
- **Colores**: Esquema profesional con variables CSS
- **Tipografía**: Inter font (Google Fonts)
- **Iconografía**: Lucide React
- **Responsive**: Mobile-first design

### **Paleta de Colores**
```css
:root {
  --background: oklch(1 0 0);           /* Blanco */
  --foreground: oklch(0.141 0.005 285.823);  /* Gris oscuro */
  --primary: oklch(0.21 0.006 285.885); /* Azul corporativo */
  --secondary: oklch(0.967 0.001 286.375); /* Gris claro */
  --accent: oklch(0.967 0.001 286.375);  /* Azul acento */
  --destructive: oklch(0.577 0.245 27.325); /* Rojo error */
  --border: oklch(0.92 0.004 286.32);    /* Gris borde */
}
```

### **Estados Visuales**
- **Confirmado**: Verde (`bg-green-100 text-green-800`)
- **Pendiente**: Amarillo (`bg-yellow-100 text-yellow-800`)
- **Cancelado**: Rojo (`bg-red-100 text-red-800`)
- **Finalizado**: Gris (`bg-gray-100 text-gray-800`)

---

## 🚀 Características Técnicas Avanzadas

### **Optimizaciones de Performance**
- **Server Components**: Para mejor SEO y carga inicial
- **App Router**: Routing optimizado de Next.js 15
- **Code Splitting**: Carga bajo demanda
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts automático

### **Arquitectura de Estado**
- **Context API**: Para autenticación global
- **Custom Hooks**: Para lógica de eventos (`useEvents`)
- **Real-time Updates**: Firestore onSnapshot listeners
- **Error Handling**: Try-catch y toast notifications

### **Seguridad**
- **Environment Variables**: Claves de Firebase en `.env.local`
- **Route Protection**: AuthGuard en todas las rutas
- **Firestore Security Rules**: (a implementar)
- **Input Validation**: Validación en formularios

---

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Adaptaciones**
- **Grid Layouts**: Adaptativos con Tailwind CSS
- **Navigation**: Menu hamburguesa en mobile
- **Forms**: Stack vertical en pantallas pequeñas
- **Tables**: Scroll horizontal en móviles

---

## 🔄 Flujo de Trabajo

### **1. Proceso de Reserva**
1. **Login**: Usuario se autentica con Google
2. **Dashboard**: Ve estado general y eventos
3. **Nuevo Evento**: Completa formulario de 8 secciones
4. **Validación**: Sistema valida disponibilidad
5. **Guardado**: Evento se guarda en Firestore
6. **Confirmación**: Toast de éxito y redirección

### **2. Gestión de Estado**
1. **Pendiente**: Evento creado, esperando confirmación
2. **Confirmado**: Cliente confirmó y pagó depósito
3. **En Progreso**: Día del evento
4. **Finalizado**: Evento completado
5. **Cancelado**: Evento cancelado por cualquier motivo

---

## 🛠️ Configuración del Entorno

### **Variables de Entorno** (`.env.local`)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_db_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Scripts NPM**
```json
{
  "dev": "next dev",        // Desarrollo
  "build": "next build",    // Build producción
  "start": "next start",    // Servidor producción
  "lint": "next lint"       // Linting código
}
```

---

## 📊 Métricas y Analytics

### **Dashboard Metrics**
- **Total de eventos**: Contador en tiempo real
- **Eventos confirmados**: Filtrado por status
- **Ingresos totales**: Suma de costos de eventos confirmados
- **Ocupación de salones**: Porcentaje de uso por fecha
- **Eventos próximos**: Timeline de próximos 7 días

### **Reportes Disponibles**
- Eventos por mes/año
- Ingresos por período
- Utilización de salones
- Clientes frecuentes
- Tipos de eventos más populares

---

## 🔮 Roadmap y Futuras Mejoras

### **Phase 2 - Corto Plazo**
- [ ] **Facturación**: Generación automática de facturas PDF
- [ ] **Calendario Interactivo**: Drag & drop para reprogramar
- [ ] **Notificaciones**: Email/SMS automáticos al cliente
- [ ] **Reportes PDF**: Exportación de eventos y reportes

### **Phase 3 - Mediano Plazo**
- [ ] **Mobile App**: Aplicación nativa React Native
- [ ] **Multi-idioma**: Soporte para inglés y español
- [ ] **Integración Pagos**: Stripe/PayPal para depósitos
- [ ] **CRM Básico**: Gestión de clientes y seguimiento

### **Phase 4 - Largo Plazo**
- [ ] **IA Predictiva**: Recomendaciones de configuración
- [ ] **API Pública**: Para integraciones externas
- [ ] **Multi-hotel**: Soporte para cadenas hoteleras
- [ ] **Dashboard Analytics**: Métricas avanzadas con gráficos

---

## 👥 Usuarios Objetivo

### **Personal del Hotel**
- **Gerente de Eventos**: Vista general y aprobaciones
- **Coordinadores**: Gestión diaria de eventos
- **Personal F&B**: Consulta de servicios asignados
- **Mantenimiento**: Revisión de setup y equipamiento

### **Casos de Uso Principales**
1. **Reserva de evento corporativo** de 100 personas
2. **Boda en Salón Diamante** con servicios completos
3. **Conferencia tech** con equipamiento especial
4. **Evento social** con múltiples espacios
5. **Meeting empresarial** de medio día

---

## 🏆 Ventajas Competitivas

### **Tecnológicas**
- **Stack Moderno**: Next.js 15 + React 19
- **Real-time**: Actualizaciones en tiempo real
- **Progressive Web App**: Funciona offline
- **Performance**: Carga rápida y optimizada

### **Funcionales**
- **Todo-en-uno**: Gestión completa de eventos
- **Intuitive UX**: Interfaz familiar y fácil
- **Escalable**: Arquitectura preparada para crecer
- **Personalizable**: Adaptable a diferentes hoteles

### **Operacionales**
- **Reduce errores**: Validaciones automáticas
- **Ahorra tiempo**: Formularios inteligentes
- **Mejora comunicación**: Datos centralizados
- **Aumenta ingresos**: Gestión eficiente

---

**🎉 Hotel Events System - Transformando la gestión de eventos hoteleros** 🎉
