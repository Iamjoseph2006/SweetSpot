# SweetSpot Mobile + API

Proyecto académico/profesional preparado para evaluación final de desarrollo móvil con **React Native (Expo)**, **Node.js/Express**, **MySQL**, arquitectura limpia y prácticas de ingeniería de software.

## ✨ Características principales
- Autenticación JWT (registro/login/perfil protegido) con control de expiración en cliente.
- CRUD de productos (crear, listar, editar, inactivar/activar, eliminar).
- Carrito y creación/seguimiento de órdenes.
- Features nativas: ubicación y filesystem (servicios/hook nativos).
- Testing por capas: unit + integration + e2e base.
- CI con GitHub Actions para validación automática en push/PR.

## 🧱 Arquitectura
Se organiza por responsabilidades y capas:

- `app/`: UI (pantallas Expo Router).
- `viewmodels/`: capa MVVM (estado/acciones de presentación).
- `services/`: acceso a API, almacenamiento seguro, integraciones nativas.
- `domain/`: modelos/tipos de dominio independientes de UI.
- `backend/`: API REST con Express (routes/controllers/services/models).
- `tests/`: pruebas de frontend (unit/integration).
- `e2e/`: pruebas end-to-end (Detox base).

## 🛠️ Stack tecnológico
- **Frontend:** Expo, React Native, TypeScript, Expo Router.
- **Backend:** Node.js, Express, MySQL, JWT.
- **Validación:** Zod.
- **Testing:** Jest, React Native Testing Library, Detox (estructura).
- **CI/CD:** GitHub Actions.

## 🚀 Instalación y ejecución

### 1) Frontend
```bash
npm ci
cp .env.example .env
npm run start
```

Variables (`.env`):
- `EXPO_PUBLIC_API_URL`: URL base del backend (`http://localhost:3000/api` por defecto sugerido).
- `EXPO_PUBLIC_E2E_MODE`: `false` para uso normal.

### 2) Backend
```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Variables (`backend/.env`):
- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

## ✅ Testing
Desde la raíz:
```bash
npm run test
npm run test:unit
npm run test:integration
```

Backend:
```bash
cd backend
npm test
```

E2E (estructura base):
```bash
npm run test:e2e:build
npm run test:e2e
```

## 🔄 CI/CD
Workflow en `.github/workflows/ci.yml`:
- instala dependencias frontend/backend,
- ejecuta pruebas,
- falla automáticamente si algún test falla.

## 🌱 Git workflow recomendado
- Branches:
  - `feature/<descripcion-corta>`
  - `fix/correct token handling in order status update and add session validation`
- Commits convencionales:
  - `feat:` `fix:` `refactor:` `test:` `docs:` `ci:`
- PR template incluido en `.github/pull_request_template.md`.
