# Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Gestión de Eventos de Hotel! 🎉

Esta guía te ayudará a entender cómo contribuir efectivamente al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo contribuir](#cómo-contribuir)
- [Reportar bugs](#reportar-bugs)
- [Sugerir nuevas características](#sugerir-nuevas-características)
- [Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)
- [Guías de estilo](#guías-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)

## 🤝 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código.

### Nuestros compromisos

- Usar un lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas de buena manera
- Centrarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## 🚀 Cómo contribuir

### Tipos de contribuciones

Valoramos todos los tipos de contribuciones:

- 🐛 **Reportes de bugs**
- ✨ **Nuevas características**
- 📝 **Mejoras en documentación**
- 🧪 **Tests**
- 🎨 **Mejoras de UI/UX**
- ⚡ **Optimizaciones de rendimiento**

## 🐛 Reportar bugs

Antes de reportar un bug:

1. **Verifica** si el bug ya fue reportado en los [Issues](https://github.com/tuusuario/hotel-events/issues)
2. **Reproduce** el bug en la última versión
3. **Documenta** los pasos para reproducir el problema

### Template para reportar bugs

```markdown
**Descripción del bug**
Una descripción clara y concisa del problema.

**Pasos para reproducir**
1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hacia '...'
4. Ve el error

**Comportamiento esperado**
Descripción clara de lo que esperabas que sucediera.

**Screenshots**
Si aplica, agrega screenshots para ayudar a explicar el problema.

**Información del entorno:**
- OS: [ej. Windows, macOS, Linux]
- Navegador: [ej. Chrome, Firefox, Safari]
- Versión: [ej. 22]
- Dispositivo: [ej. Desktop, Mobile - iPhone X]

**Información adicional**
Cualquier otro contexto sobre el problema.
```

## ✨ Sugerir nuevas características

### Antes de sugerir

1. **Verifica** si la característica ya fue sugerida
2. **Considera** si se alinea con los objetivos del proyecto
3. **Piensa** en los casos de uso específicos

### Template para nuevas características

```markdown
**¿La característica está relacionada con un problema?**
Descripción clara del problema. Ej. "Me frustra cuando [...]"

**Describe la solución que te gustaría**
Descripción clara y concisa de lo que quieres que suceda.

**Describe alternativas consideradas**
Descripción de soluciones alternativas o características consideradas.

**Información adicional**
Contexto adicional, screenshots, o mockups sobre la característica.
```

## 🛠️ Configuración del entorno de desarrollo

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Git
- Cuenta de Firebase (para desarrollo)

### Pasos de configuración

1. **Fork** el repositorio
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/tuusuario/hotel-events.git
   cd hotel-events
   ```

3. **Instala** las dependencias:
   ```bash
   npm install
   ```

4. **Configura** las variables de entorno:
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus credenciales de Firebase
   ```

5. **Ejecuta** el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar linter
- `npm run lint:fix` - Corregir errores de linting automáticamente

## 📏 Guías de estilo

### Código

- **TypeScript**: Utiliza tipado estricto
- **ESLint**: Sigue las reglas configuradas
- **Prettier**: Formateado automático de código
- **Naming**: Usa camelCase para variables y funciones, PascalCase para componentes

### Componentes React

```typescript
// ✅ Bueno
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
    >
      {children}
    </button>
  );
}
```

### CSS/Tailwind

- Usa clases utilitarias de Tailwind CSS
- Para estilos complejos, crea componentes reutilizables
- Sigue mobile-first approach
- Usa variables CSS para tokens de diseño

```tsx
// ✅ Bueno - Mobile-first responsive
<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
  <Card className="w-full md:w-1/2" />
  <Card className="w-full md:w-1/2" />
</div>
```

### Commits

Utiliza [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar filtro por fecha en eventos
fix: corregir error de validación en formulario
docs: actualizar README con instrucciones de instalación
style: mejorar espaciado en cards de eventos
refactor: reorganizar hooks de eventos
test: agregar tests para componente Calendar
```

Tipos de commit:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactoring de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, dependencias, etc.

## 🔄 Proceso de Pull Request

### Antes de enviar

1. **Asegúrate** de que tu código pase el linter:
   ```bash
   npm run lint
   ```

2. **Ejecuta** los tests (cuando estén disponibles):
   ```bash
   npm run test
   ```

3. **Verifica** que el build funcione:
   ```bash
   npm run build
   ```

### Creando el PR

1. **Crea** una rama para tu feature:
   ```bash
   git checkout -b feat/nombre-caracteristica
   ```

2. **Haz** commits descriptivos siguiendo conventional commits

3. **Push** a tu fork:
   ```bash
   git push origin feat/nombre-caracteristica
   ```

4. **Crea** el Pull Request con:
   - Título descriptivo
   - Descripción detallada de los cambios
   - Screenshots si hay cambios visuales
   - Referencias a issues relacionados

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Pruebas manuales

## Screenshots (si aplica)
[Agrega screenshots aquí]

## Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He realizado los cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi característica funciona
```

## 🎯 Áreas de contribución prioritarias

### Alto impacto
- 🔒 **Seguridad**: Mejoras en autenticación y autorización
- ⚡ **Rendimiento**: Optimizaciones de velocidad y memoria
- 📱 **Responsive**: Mejoras en experiencia móvil
- ♿ **Accesibilidad**: Cumplimiento de estándares WCAG

### Medio impacto
- 🧪 **Testing**: Cobertura de tests
- 📚 **Documentación**: Guías y tutoriales
- 🎨 **UI/UX**: Mejoras visuales y de usabilidad
- 🔧 **DevEx**: Herramientas de desarrollo

### Características futuras
- 🌙 **Modo oscuro**
- 📊 **Analytics avanzados**
- 🔔 **Notificaciones push**
- 📄 **Exportación PDF**
- 🌐 **Internacionalización**

## 📞 ¿Necesitas ayuda?

- 💬 **Discusiones**: Para preguntas generales sobre el proyecto
- 🐛 **Issues**: Para reportar bugs o sugerir características
- 📧 **Email**: [tu-email@ejemplo.com] para consultas privadas

## 🙏 Reconocimientos

- Todos los contribuidores serán agregados al README
- Las contribuciones significativas serán destacadas en releases
- Feedback constructivo y revisiones de código son muy valorados

---

¡Esperamos tus contribuciones! 🚀✨
