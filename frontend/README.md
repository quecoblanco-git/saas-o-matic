# Frontend de SaaS-O-Matic

Interfaz React y TypeScript construida con Vite y Tailwind CSS. El código de producto se organiza por funciones en `src/features/`; las llamadas HTTP compartidas están en `src/api/`.

## Desarrollo

Desde la raíz del repositorio, ejecuta `npm run setup` y `npm run dev` siguiendo el [README principal](../README.md). Vite sirve la aplicación en `http://localhost:5173` y redirige `/api` a `http://localhost:3001`.

## Comprobaciones

```bash
npm test
npm run lint
npm run build
```

Vitest ejecuta las pruebas; Oxlint analiza el código y el build ejecuta TypeScript y genera los archivos de producción en `dist/`.
