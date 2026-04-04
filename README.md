# SweetSpot Mobile + API

Proyecto académico/profesional preparado para evaluación final de desarrollo móvil.
Desarrollado con **React Native (Expo)**, **Node.js/Express**, **MySQL**, aplicando **arquitectura limpia**, **MVVM** y buenas prácticas de ingeniería de software.

---

# ✨Características principales

* 🔐 **Autenticación JWT** (registro, login, perfil protegido) con manejo de expiración en cliente
* 🛍️ **CRUD completo de productos** (crear, listar, editar, activar/inactivar, eliminar)
* 🧾 **Carrito y gestión de órdenes** (creación y seguimiento)
* 📱 **Funcionalidades nativas**: geolocalización y filesystem
* 🧪 **Testing por capas**: unitario, integración y base E2E
* ⚙️ **CI/CD** con GitHub Actions en push y pull request

---

# 🧱 Arquitectura

El proyecto sigue principios de **Clean Architecture** y patrón **MVVM**, separando responsabilidades:

```
app/           → UI (pantallas con Expo Router)
viewmodels/    → lógica de presentación (estado y acciones)
services/      → acceso a API, storage y features nativas
domain/        → modelos y lógica de negocio independiente
backend/       → API REST (Express + MySQL)
tests/         → pruebas frontend
e2e/           → pruebas end-to-end (estructura base)
```

---

# 🛠️ Stack tecnológico

### Frontend

* Expo + React Native
* TypeScript
* Expo Router

### Backend

* Node.js
* Express
* MySQL
* JWT

### Otros

* Validación: Zod
* Testing: Jest, React Native Testing Library, Detox
* CI/CD: GitHub Actions

---

# 🚀 Instalación y ejecución

## 1️⃣ Frontend

```bash
npm ci
cp .env.example .env
npm run start
```

### Variables (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_E2E_MODE=false
```

---

## 2️⃣ Backend

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

### Variables (backend/.env)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sweetspot
JWT_SECRET=your_secret_key
```

---

# 🧪 Testing

## Frontend

```bash
npm run test
npm run test:unit
npm run test:integration
```

## Backend

```bash
cd backend
npm test
```

## E2E (estructura base)

```bash
npm run test:e2e:build
npm run test:e2e
```

---

# ⚙️ CI/CD

El pipeline definido en:

```
.github/workflows/ci.yml
```

Realiza automáticamente:

* instalación de dependencias
* ejecución de pruebas frontend y backend
* validación en cada **push** y **pull request**

✔ Si algún test falla → el pipeline falla automáticamente

---

# 📸 Evidencia visual

Capturas disponibles en:

```
docs/screenshots/
```

> ⚠️ Importante: Estas capturas deben mostrar login, CRUD completo y funcionalidades nativas.

---

# 🌱 Flujo de trabajo con Git

## 📌 Estrategia de ramas

```
fix/*        → corrección de errores
refactor/*   → mejoras de arquitectura o código
chore/*      → configuración, CI/CD, documentación
test/*       → pruebas
```

> `feature/*` se utiliza solo cuando se agregan nuevas funcionalidades relevantes.

---

## 📝 Commits convencionales

```
feat: nueva funcionalidad
fix: corrección de error
refactor: mejora interna sin cambiar funcionalidad
test: agregar o modificar tests
docs: documentación
ci: cambios en pipeline
```

---

## 🔀 Pull Requests

Se utiliza template en:

```
.github/pull_request_template.md
```

Incluye:

* descripción del cambio
* checklist de calidad
* tipo de cambio

---

# 🎯 Objetivo del proyecto

Este proyecto demuestra:

* Aplicación de arquitectura limpia en mobile
* Integración completa frontend + backend
* Uso de autenticación segura
* Consumo de APIs REST
* Automatización con CI/CD
* Buenas prácticas de desarrollo profesional

---

# 🏁 Estado

✅ Proyecto listo para evaluación final
🚀 Nivel: producción académica / junior profesional

---
