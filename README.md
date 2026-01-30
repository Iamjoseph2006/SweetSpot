# Sweet Spot - App Móvil

Proyecto académico que implementa registro, inicio de sesión y control de acceso usando una API REST y una aplicación móvil en Expo.

## Tecnologías
- Backend: Node.js, Express, MySQL
- Frontend: Expo (React Native)
- Autenticación: JWT

## Instalación Backend
1. Clonar el repositorio
2. Instalar dependencias:
   npm install
3. Crear archivo .env con las variables:
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=sweetspot_db
   JWT_SECRET=mi_secreto
4. Ejecutar:
   npm start

## Instalación App Móvil
1. Instalar Expo Go en el celular
2. Ejecutar:
   npx expo start
3. Escanear el QR desde Expo Go

## Funcionalidades
- Registro de usuarios
- Inicio de sesión
- Vista protegida (Dashboard)
- Cierre de sesión
