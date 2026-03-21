# Informe técnico de estrategia de pruebas - SweetSpot

## 1) Enfoque arquitectónico para testabilidad

La estrategia aplicada separa validación, transformación y manejo de errores en funciones puras (`services/authLogic.ts`), mientras que las pantallas mantienen el rol de capa de presentación. Esta separación permite probar lógica de negocio sin depender de componentes visuales.

## 2) Pruebas unitarias

Se implementaron pruebas unitarias para:

- Validación de reglas de registro con Zod (`tests/unit/registerSchema.test.ts`).
- Transformación de datos de autenticación y normalización de correo (`tests/unit/authLogic.test.ts`).
- Manejo de errores internos mediante fallback (`tests/unit/authLogic.test.ts`).

## 3) Pruebas de integración

Se implementaron pruebas de integración del flujo de `LoginScreen`:

- Validación de interacción UI + lógica de validación.
- Validación de interacción UI + servicios (`loginUser`, `saveToken`) + navegación.

Archivo: `tests/integration/login.integration.test.tsx`.

## 4) Prueba End-to-End (E2E)

Se añadió flujo E2E de login con Detox (`e2e/login.e2e.js`) y configuración base (`.detoxrc.js`, `e2e/jest.config.js`).

Este test valida un flujo completo de usuario desde entrada de credenciales hasta visualización del dashboard.

## 5) Bibliografía

- Jest Documentation: https://jestjs.io/docs/getting-started
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/
- Detox Documentation: https://wix.github.io/Detox/
- Zod Documentation: https://zod.dev/
