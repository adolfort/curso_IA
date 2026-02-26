# Arquitectura: Persistencia con Adapter (Inversión de Dependencias)

Este documento describe cómo integrar un adapter de persistencia en el Gestor ICE para aplicar inversión de dependencias: la app React solo depende de una interfaz/contrato, y la implementación concreta (localStorage / HTTP → PostgreSQL) queda aislada en `src/services/persistence`.

Objetivo
- Permitir cambiar la estrategia de persistencia (ej. pasar de `localStorage` a un backend con PostgreSQL) modificando un único archivo en `src/services/persistence` sin tocar componentes React ni hooks de negocio.

Principios
- Dependencia en abstracciones, no en implementaciones.
- API asíncrona (promise-based) para facilidad de futuro: permitimos adaptadores sincrónos (localStorage) y remotos (fetch/http).
- Un único punto de exportación (factory / index) que decide la implementación utilizada por la app.

Estructura propuesta (carpeta)

- `src/services/persistence/`
  - `adapter.ts` — Definición de la interfaz `IPersistenceAdapter` (tipos, métodos).  
  - `localStorageAdapter.ts` — Implementación por defecto que usa `localStorage` (para MVP).  
  - `httpAdapter.ts` — Implementación que llama a un backend REST/GraphQL (ej. backend que use PostgreSQL).  
  - `factory.ts` — Punto donde se selecciona la implementación concreta (por ejemplo, exporta `defaultAdapter`).  
  - `migrations.md` — (opcional) notas sobre cómo mapear datos entre implementaciones.

Interfaz (`IPersistenceAdapter`) — métodos mínimos
- `getTasks(): Promise<Task[]>` — devuelve todas las tareas (ya ordenadas o sin ordenar, documentar la expectativa).  
- `saveTasks(tasks: Task[]): Promise<void>` — persiste el array completo (útil para reemplazo simple).  
- `addTask(task: Task): Promise<void>` — insertar una tarea.  
- `updateTask(task: Task): Promise<void>` — actualizar una tarea por `id`.  
- `deleteTask(id: string): Promise<void>` — borrar tarea.  
- `getApiKey(): Promise<string | null>` — obtener API key (o string vacío).  
- `saveApiKey(key: string): Promise<void>` — guardar API key.  

Notas de diseño sobre la interfaz
- Todas las funciones devuelven `Promise` aunque la impl local sea síncrona. Esto evita cambios en el código de los consumidores cuando pasamos a una impl. remota.  
- Errores: las implementaciones deben lanzar excepciones en fallos (`throw`). El consumo en hooks/higher-level debe `try/catch` y mostrar `Toast` en caso de fallo.  

Implementación por defecto: `localStorageAdapter.ts`
- Internamente implementa los métodos anteriores usando `localStorage` y JSON.  
- Realiza validaciones básicas (coerción de tipos, límites de 1–10 para I/C/E, reemplazo seguro si el key `tasks` contiene datos corruptos).  
- Exporta una instancia: `export const localStorageAdapter: IPersistenceAdapter = { ... }`.

Implementación remota: `httpAdapter.ts` (ejemplo)
- Implementa la misma interfaz pero delega en llamadas `fetch('/api/tasks')` al backend.  
- El backend puede usar PostgreSQL; la app React no necesita conocer ese detalle.  
- Este adapter implementa reconexión / reintentos leves o mapea errores HTTP a excepciones JS.  

Selección de la implementación: `factory.ts`
- Exporta `defaultAdapter: IPersistenceAdapter` que es el que consumirán los hooks.  
- Estrategias de selección:
  - Leer `process.env.PERSISTENCE` (Vite) o una variable en tiempo de build.  
  - O mantener un único archivo donde se comente la línea a sustituir: `export default localStorageAdapter` → cambiar por `export default httpAdapter` cuando haya backend listo.
- La idea es que cambiar una sola exportación modifica toda la persistencia.

Consumo desde React
- `useLocalStorage` y `useTasks` no llaman directamente a `localStorage`; llaman al adapter importado desde `src/services/persistence/factory`:

  // pseudocódigo de consumo (no código real):
  // const adapter = defaultAdapter
  // await adapter.getTasks()
  // await adapter.saveTasks(tasks)

- De esta manera los hooks y componentes permanecen sin cambios.

Migraciones de datos
- Si se migra de `localStorage` a backend, añadir una secuencia de arranque (migration script o endpoint) que lea el contenido local y lo suba al backend.  
- Documentar el proceso en `src/services/persistence/migrations.md`.

Testing
- Proveer un adapter mock en `tests/mocks/persistenceMock.ts` que implemente `IPersistenceAdapter` (útil en unit tests de hooks/componentes).  
- Así los tests no dependen de `localStorage` real ni de un servidor HTTP.

Ventajas
- Aislamiento claro entre UI y persistencia.  
- Fácil sustitución por una solución escalable (Postgres via backend) sin tocar React.  
- Mejor testabilidad (mock fácil), manejo unificado de errores, y coherencia de contratos.

Recomendación operativa
- Implementar `adapter.ts` y `localStorageAdapter.ts` ahora.  
- Mantener `factory.ts` simple y explícito (cambiar allí para cambiar la impl).  
- Documentar la convención de que todos los métodos devuelven `Promise`.

Ejemplo de rutas de archivos (resumen)

- `src/services/persistence/adapter.ts`  
- `src/services/persistence/localStorageAdapter.ts`  
- `src/services/persistence/httpAdapter.ts`  
- `src/services/persistence/factory.ts`  
- `src/services/persistence/migrations.md`

---

Si quieres, creo los archivos `adapter.ts` y `localStorageAdapter.ts` (solo tipos y firmas, sin implementación), junto con `factory.ts` que exporta la impl por defecto. ¿Lo genero ahora como plantilla en TypeScript?