# Minimum Spec Pack — Gestor de Tareas ICE

Versión: 1.0
Fecha: 24/02/2026

Breve: colección mínima y ejecutable de especificaciones necesarias para comenzar el desarrollo del MVP "Gestor de Tareas ICE" (React + Vite + TypeScript + MUI). Este documento recoge objetivo, modelo de datos, reglas clave, estructura propuesta y contratos imprescindibles (incluye adapter de persistencia para inversión de dependencias).

---

## 1. Objetivo
Aplicación SPA en React para crear y priorizar tareas usando el modelo ICE. Persistencia en `localStorage` (MVP) pero diseñada para poder cambiar a backend (PostgreSQL) sin tocar lógica React, mediante un adapter de persistencia.

## 2. Stack mínimo
- React 18+ + TypeScript
- Vite
- Material UI v5 (@mui/material + @emotion)
- `fetch` nativo para llamadas externas
- No librerías de estado global (usar hooks personalizados)

## 3. Alcance (MVP cerrado)
- Crear tareas (título obligatorio, descripción opcional)
- Calcular ICE automáticamente con Google Gemini (opcional por tarea)
- Edición manual de Impact/Confidence/Effort (1–10) y recalculo en tiempo real
- Cambiar estado (esperando / en_curso / hecha) — confirmar al marcar como `hecha`
- Eliminar tarea (confirmación)
- Persistencia local (`localStorage`) y modal para configurar API key
- UI con MUI: Dialogs (confirm, api key), Snackbar (toasts), Cards, Chip (badge)

## 4. Modelo ICE (regla única)
ICE = round((impact × confidence) / effort)
- impact, confidence, effort: 1–10
- effort = 0 → tratar como 1
- Resultado entero 0–100
- Default al crear: impact=5, confidence=5, effort=5 → ICE=5

## 5. Modelo de datos (resumen)
Task {
- id: string (Date.now().toString())
- title: string (req, max 100)
- description?: string (max 200)
- state: 'esperando' | 'en_curso' | 'hecha'
- impact: number (1–10)
- confidence: number (1–10)
- effort: number (1–10)
- iceScore: number (0–100)
- aiCalculated: boolean
- createdAt: number (timestamp)
}

(El archivo de tipos TypeScript ya existe en `src/types/task.ts`.)

## 6. Reglas de ordenamiento y presentación
- La lista muestra siempre todas las tareas, orden final:
  1. Tareas no-`hecha`, por ICE descendente
  2. Tareas `hecha`, por ICE descendente
- Las acciones que cambian I/C/E o estado deben desencadenar reordenamiento y persistencia.

## 7. Contratos clave (Persistencia — inversion de dependencias)
Implementar un adapter con la interfaz `IPersistenceAdapter` (promise-based). Métodos mínimos:
- `getTasks(): Promise<Task[]>`
- `saveTasks(tasks: Task[]): Promise<void>`
- `addTask(task: Task): Promise<void>`
- `updateTask(task: Task): Promise<void>`
- `deleteTask(id: string): Promise<void>`
- `getApiKey(): Promise<string | null>`
- `saveApiKey(key: string): Promise<void>`

Notas:
- Todos los métodos devuelven Promise para permitir swap sin cambios a consumidores.
- La implementación por defecto (MVP) es `localStorageAdapter` en `src/services/persistence/localStorageAdapter.ts`.
- Cambiar implementación editando únicamente `src/services/persistence/factory.ts`.

## 8. Integración con Google Gemini (resumen)
- Endpoint (posterior lectura en doc): POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}
- Prompt: instrucción para devolver SOLO un JSON con `impact`, `confidence`, `effort`.
- Parseo: extraer `response.candidates[0].content.parts[0].text`, buscar primer JSON con regex `/\{[\s\S]*?\}/`, `JSON.parse`, validar rangos 1–10.
- Errores: mostrar Toast (no alterar valores actuales).

## 9. Componentes y carpetas (resumen mínimo)
Estructura propuesta (esencial):

- `src/`
  - `components/` — componentes UI reutilizables: `Layout`, `PriorityBadge`, wrappers si hace falta
  - `components/modals/` — `ConfirmModal`, `ApiKeyModal`, `Toast`
  - `features/tasks/` — `TaskForm`, `TaskList`, `TaskCard`, `TaskControls`, `tasks.types.ts`, `TaskService` (pure helpers)
  - `features/apiKey/` — `useApiKey` hook y UI del modal
  - `services/persistence/` — `adapter.ts`, `localStorageAdapter.ts`, `httpAdapter.ts` (futuro), `factory.ts`
  - `utils/` — `ice.ts`, `gemini.ts`, helpers
  - `hooks/` — `useTasks.ts`, `useLocalStorage.ts`, `useToast.ts`, `useConfirm.ts`
  - `types/` — `task.ts`
  - `theme/` — `theme.ts`

(Plantillas TypeScript para el adapter ya generadas en `src/services/persistence/`.)

## 10. Gestión del estado (sin libs)
Patrón recomendado:
- Hook central `useTasks()` que expone: `tasks`, `addTask`, `updateTask`, `deleteTask`, `recalculateICEForTask`, `setTasks`.
  - `useTasks` se inicializa desde `defaultAdapter.getTasks()` (lazy init) y persiste con `saveTasks()` tras cambios.
  - Encapsula reglas de negocio (calcular ICE seguro, aiCalculated flag, ordenamiento). 
- `useApiKey()` para manejar la API key (lazy init desde adapter).
- `useConfirm()` y `useToast()` para modales y mensajes globales; `ConfirmModal` y `Toast` renderizados por `App` y controlados por hooks.
- Cargas por tarjeta: `loadingIds` o `isLoading` local en `TaskCard` para bloquear inputs durante cálculo IA.

## 11. UX / Comportamientos críticos
- No usar `window.confirm/alert/prompt`; todos los diálogos con MUI `Dialog`.
- `ApiKeyModal` obligatorio en primer uso (no permitir cerrar sin key salvo que ya exista).
- Botón `Calcular ICE`: estado `Calculando…` y deshabilitado; inputs I/C/E deshabilitados mientras dura la petición.
- Toasts para errores y éxitos (auto-hide 3s).

## 12. Testing y mocks
- Proveer `tests/mocks/persistenceMock.ts` que implemente `IPersistenceAdapter` (unit tests de hooks/componentes).
- Testear `ice.ts` y `gemini.ts` parsing con ejemplos.

## 13. Comandos de desarrollo sugeridos
(Asumiendo plantilla Vite + TS + MUI)

Instalar:
```bash
pnpm install
# o
npm install
```
Desarrollo:
```bash
pnpm dev
# o
npm run dev
```
Build:
```bash
pnpm build
# o
npm run build
```

## 14. Archivos / referencias en este repo
- Especificación de producto: `mvp_gestor_tareas_ice.md` (detallado)
- Diagramas: `design/create-task-flow.svg|png`, `design/navigation-flow.svg|png`, `design/app-screens.svg|png`
- Arquitectura persistencia: `design/architecture.md`
- Plantillas TS adapter: `src/services/persistence/*`

## 15. Próximos pasos recomendados
- Implementar `useTasks()` consumiendo `src/services/persistence/factory.ts`.
- Implementar `TaskList` y `TaskCard` (usar reglas de ordenamiento definidas).
- Añadir `httpAdapter.ts` plantilla si se quiere preparar backend.
- Revisar y ejecutar migración si se necesita mover datos de `localStorage` → backend.
> Nota: la configuración inicial del proyecto ya está completada y verificada en esta rama.
---

Contacto: equipo de desarrollo — usar este README como contrato de requisitos mínimos para la primera entrega del MVP.
