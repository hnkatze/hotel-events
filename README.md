# 🏨 Sistema de Eventos - Hotel Management

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-9.0-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</div>

<div align="center">
  <h3>🚀 Sistema completo de gestión de eventos para hoteles</h3>
  <p>Una solución moderna, responsive y eficiente para administrar eventos, salones, personal y reservas hoteleras</p>
</div>

---

## ✨ Características Principales

### 📅 **Gestión de Eventos**
- ✅ Creación y edición completa de eventos
- ✅ Seguimiento de estados (Pendiente, Confirmado, Cancelado, Finalizado)
- ✅ Gestión de información del cliente
- ✅ Control financiero (costos, depósitos, pagos)
- ✅ Configuración de servicios y equipamiento

### 🏛️ **Administración de Salones**
- ✅ Gestión de 5+ salones con capacidades personalizadas
- ✅ Configuraciones flexibles (Teatro, Banquete, Cóctel, etc.)
- ✅ Control de disponibilidad en tiempo real
- ✅ Precios por hora y especificaciones técnicas

### 👥 **Gestión de Personal**
- ✅ Coordinadores de eventos
- ✅ Personal de cocina y supervisores
- ✅ Meseros y personal de servicio
- ✅ Seguridad y apoyo logístico

### 📊 **Dashboard Inteligente**
- ✅ Estadísticas en tiempo real
- ✅ Indicadores de ingresos y ocupación
- ✅ Vista general de eventos próximos
- ✅ Estado de salones disponibles

### 🗓️ **Calendario Visual**
- ✅ Vista mensual con eventos codificados por color
- ✅ Filtros por salón y tipo de evento
- ✅ Información detallada por día
- ✅ Navegación intuitiva

## 🖥️ **Experiencia Responsive**

### 📱 **Mobile-First Design**
- ✅ Navegación lateral con menú hamburguesa
- ✅ Grid adaptable para diferentes pantallas
- ✅ Tipografía y espaciado responsive
- ✅ Formularios optimizados para móviles

### 💻 **Desktop Experience**
- ✅ Layout completo con navegación horizontal
- ✅ Múltiples columnas para mejor aprovechamiento
- ✅ Shortcuts y accesos rápidos
- ✅ Vista detallada de información

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/hnkatze/hotel-events.git
cd hotel-events
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

4. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconografía moderna

### **Backend & Base de Datos**
- **Firebase Auth** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Storage** - Almacenamiento de archivos

### **UI/UX**
- **Sonner** - Notificaciones toast elegantes
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Soporte para tema oscuro (futuro)

### **Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **TypeScript** - Verificación de tipos

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── calendar/          # Vista de calendario
│   ├── events/            # Gestión de eventos
│   │   ├── [id]/         # Detalles de evento
│   │   │   └── edit/     # Edición de evento
│   │   └── new/          # Creación de evento
│   ├── personal/          # Gestión de personal
│   ├── salones/           # Gestión de salones
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── auth-guard.tsx    # Protección de rutas
│   ├── mobile-nav.tsx    # Navegación móvil
│   └── user-menu.tsx     # Menú de usuario
├── contexts/             # Contextos de React
│   └── auth-context.tsx  # Contexto de autenticación
├── hooks/                # Hooks personalizados
│   ├── use-events.ts     # Hook para eventos
│   ├── use-salones.ts    # Hook para salones
│   ├── use-personal.ts   # Hook para personal
│   └── use-hotel-config.ts
└── lib/                  # Utilidades y configuración
    ├── firebase.ts       # Configuración Firebase
    └── utils.ts          # Utilidades generales
```

## 🔐 Características de Seguridad

- ✅ **Autenticación Firebase** - Login seguro con email/password
- ✅ **Protección de rutas** - AuthGuard para rutas privadas
- ✅ **Validación de datos** - Validación en cliente y servidor
- ✅ **Reglas de Firestore** - Seguridad a nivel de base de datos

## 📱 PWA (Progressive Web App)

- ✅ **Manifest.json** - Instalable como app nativa
- ✅ **Service Worker** - Funcionamiento offline (futuro)
- ✅ **Responsive Icons** - Iconos para todas las plataformas
- ✅ **Meta tags optimizados** - SEO y redes sociales

## 🌐 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno**
3. **Deploy automático**

```bash
npm run build
```

### Variables de Entorno en Producción

Asegúrate de configurar las mismas variables de entorno en tu plataforma de deployment.

## 🤝 Contribución

### Reportar Issues
1. Usa el [issue tracker](https://github.com/hnkatze/hotel-events/issues)
2. Describe el problema detalladamente
3. Incluye pasos para reproducir

### Pull Requests
1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Hotel Events Team**
- GitHub: [@hnkatze](https://github.com/hnkatze)
- Email: soporte@hotelevents.com

## 🙏 Agradecimientos

- [Next.js Team](https://nextjs.org/) - Por el increíble framework
- [Tailwind CSS](https://tailwindcss.com/) - Por el sistema de diseño
- [Radix UI](https://radix-ui.com/) - Por los componentes accesibles
- [Firebase](https://firebase.google.com/) - Por la infraestructura backend

---

<div align="center">
  <p>⭐ Si este proyecto te resulta útil, ¡no olvides darle una estrella!</p>
  <p>Hecho con ❤️ para la industria hotelera</p>
</div>
