# SweetSpot Mobile + API

Aplicación móvil académica para gestión de productos, carrito y pedidos, con autenticación JWT y backend REST.

## Arquitectura

### Frontend (Expo / React Native)
- `app/`: capa UI (pantallas y navegación).
- `viewmodels/`: lógica de presentación (MVVM).
- `services/`: acceso a API/infraestructura.
- `domain/`: reglas de negocio y validaciones reutilizables.
- `validation/`: esquemas de formulario (Zod).

### Backend (Node.js / Express)
- `controllers/`: casos de uso HTTP.
- `routes/`: definición REST.
- `services/`: lógica de autenticación.
- `models/`: acceso a datos MySQL.
- `middlewares/`: auth/autorización.

## Tech Stack
- **Mobile:** Expo, React Native, TypeScript, Expo Router
- **Backend:** Node.js, Express, MySQL
- **Auth:** JWT + almacenamiento seguro (SecureStore fallback)
- **Testing:** Jest, React Native Testing Library, Detox (estructura E2E)
- **CI/CD:** GitHub Actions

## Requisitos previos
- Node.js 20+
- npm 10+
- MySQL 8+
- Expo CLI (opcional, vía npx)

## Configuración de entorno

### Frontend
1. Copiar variables:
   ```bash
   cp .env.example .env
   ```
2. Ajustar `EXPO_PUBLIC_API_URL` según tu red.

### Backend
1. Copiar variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Completar credenciales de base de datos y secreto JWT.

## Instalación y ejecución

### 1) Backend
```bash
cd backend
npm ci
npm run dev
```
API base: `http://localhost:3000/api`

### 2) Frontend
```bash
npm ci
npm run start
```

## CRUD disponible
- **Productos:** crear, listar, actualizar, eliminar (y activar/inactivar).
- **Carrito:** agregar, listar por usuario, eliminar ítems.
- **Pedidos:** crear pedido desde carrito, listar pedidos, actualizar estado (admin).

## Testing

### Frontend
```bash
npm run test
npm run test:unit
npm run test:integration
```

### Backend
```bash
cd backend
npm test
```

### E2E (base con Detox)
```bash
npm run test:e2e:build
npm run test:e2e
```

## CI/CD
Pipeline en `.github/workflows/ci.yml`:
- Instala dependencias.
- Ejecuta lint + tests frontend.
- Ejecuta tests backend.
- Falla automáticamente si alguna verificación falla.

## Flujo Git recomendado
- Ramas: `feature/*` y `fix/*`.
- Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`.
- PR template: `.github/pull_request_template.md`.
- Guía: `CONTRIBUTING.md`.

## Capturas
- `docs/screenshots/login.png` (placeholder)
- `docs/screenshots/admin-products.png` (placeholder)
