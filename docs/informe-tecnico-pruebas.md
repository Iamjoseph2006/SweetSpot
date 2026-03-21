# Informe técnico de estrategia de pruebas - SweetSpot

## 1) Enfoque arquitectónico para testabilidad

La estrategia aplicada separa validación, transformación y manejo de errores en funciones puras (`services/authLogic.ts`), mientras que las pantallas mantienen el rol de capa de presentación. Esta separación permite probar lógica de negocio sin depender de componentes visuales.

Además, la capa de acceso a datos se concentra en `services/api.ts`, lo que facilita simular respuestas del backend tanto en pruebas de integración como en la prueba End-to-End. Para el flujo E2E se agregó un modo controlado por variables de entorno (`EXPO_PUBLIC_E2E_MODE`) que evita depender de un backend real y hace determinista la navegación de login a dashboard.

## 2) Pruebas unitarias

Se implementaron pruebas unitarias para:

- Validación de reglas de registro con Zod (`tests/unit/registerSchema.test.ts`).
- Transformación de datos de autenticación y normalización de correo (`tests/unit/authLogic.test.ts`).
- Manejo de errores internos mediante fallback (`tests/unit/authLogic.test.ts`).
- Cobertura del rol por defecto y rol explícito en el payload de registro (`tests/unit/authLogic.test.ts`).

Estas pruebas validan la lógica desacoplada de la UI y permiten detectar regresiones en reglas de negocio sin renderizar pantallas.

## 3) Pruebas de integración

Se implementaron pruebas de integración del flujo de `LoginScreen`:

- Validación de interacción UI + lógica de validación.
- Validación de interacción UI + servicios (`loginUser`, `saveToken`) + navegación.
- Validación del manejo de error cuando el servicio rechaza credenciales.

Archivo principal: `tests/integration/login.integration.test.tsx`.

## 4) Prueba End-to-End (E2E)

Se añadió flujo E2E de login con Detox (`e2e/login.e2e.js`) y configuración base (`.detoxrc.js`, `e2e/jest.config.js`).

Esta prueba simula el flujo completo del usuario:

1. Abrir la aplicación.
2. Capturar correo y contraseña.
3. Ejecutar el login.
4. Validar la navegación al dashboard.
5. Confirmar que el mensaje cargado pertenece al flujo controlado de E2E.

Para mejorar la estabilidad del test, los componentes clave incluyen `testID` y el servicio de API soporta un modo de pruebas E2E con respuestas predecibles.

## 5) Ejecución sugerida y evidencias

### Pruebas unitarias

```bash
npm run test:unit -- --runInBand
```

### Pruebas de integración

```bash
npm run test:integration -- --runInBand
```

### Prueba E2E

```bash
npx detox build --configuration android.emu.debug
npm run test:e2e
```

Evidencias sugeridas:

- Captura de terminal mostrando pruebas unitarias exitosas.
- Captura de terminal mostrando pruebas de integración exitosas.
- Captura o video del emulador ejecutando la prueba E2E satisfactoriamente.
- Enlace del repositorio GitHub con el proyecto completo.

## 6) Bibliografía

- Jest Documentation: https://jestjs.io/docs/getting-started
- React Native Testing Library: https://callstack.github.io/react-native-testing-library/
- Detox Documentation: https://wix.github.io/Detox/
- Expo testing guidance: https://docs.expo.dev/develop/unit-testing/
- Zod Documentation: https://zod.dev/
