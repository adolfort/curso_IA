# Implementation Tasks — Gestor de Tareas ICE

Fecha: 24/02/2026

Lista priorizada y ordenada de 8 tareas de implementación para el MVP. Cada tarea incluye propósito, entregable mínimo y criterios de aceptación.

---

1) Scaffold project (Vite + TypeScript + MUI)
- Propósito: Crear base del proyecto y entorno de desarrollo.
- Entregable: Proyecto Vite + TS inicial, `package.json`, `tsconfig.json`, `vite.config.ts`, MUI instalado y `main.tsx` con `ThemeProvider`.
- Criterios de aceptación: `pnpm dev` / `npm run dev` arranca, página base muestra App shell.

2) Define types & persistence adapter
- Propósito: Establecer modelos y contrato de persistencia (IPersistenceAdapter).
- Entregable: `src/types/task.ts`, `src/services/persistence/adapter.ts`, `localStorageAdapter.ts`, `factory.ts`.
- Criterios de aceptación: Tipos compilables, adapter por defecto exportado desde `factory.ts`.

3) Implement useTasks hook and services
- Propósito: Lógica central de estado y operaciones sobre tareas.
- Entregable: `src/hooks/useTasks.ts`, `src/features/tasks/TaskService.ts` (add/update/delete/reorder/calculateICE).
- Criterios de aceptación: Hook expone `tasks`, `addTask`, `updateTask`, `deleteTask`, `recalculateICEForTask`; persiste usando `defaultAdapter`.

4) Build layout, header and ApiKey modal
- Propósito: Montar shell de la app y gestión de API key.
- Entregable: `Layout.tsx` (AppBar), `ApiKeyModal.tsx`, `useApiKey` hook.
- Criterios de aceptación: Modal se abre si no hay key; botón `⚙ API Key` en header abre modal; key se guarda vía adapter.

5) Implement TaskForm and add flow
- Propósito: Interfaz para crear tareas con validaciones y toast.
- Entregable: `TaskForm.tsx`, validaciones (título req, límites longitudes), toast de éxito al crear.
- Criterios de aceptación: Crear tarea con defaults (I/C/E=5), persistida en adapter y visible en lista.

6) Implement TaskList and TaskCard UI
- Propósito: Mostrar tarjetas ordenadas y controles I/C/E y estado.
- Entregable: `TaskList.tsx`, `TaskCard.tsx`, `PriorityBadge.tsx`, `TaskControls.tsx`.
- Criterios de aceptación: Orden correcto (no-hecha por ICE desc; luego hecha por ICE desc), editar I/C/E recalcula ICE en tiempo real, badge de prioridad refleja rangos.

7) Integrate Gemini helper and IA flow
- Propósito: Conectar el botón `✨ Calcular ICE` con el helper `askGeminiForICE`.
- Entregable: `src/utils/gemini.ts`, manejo de loading por tarjeta, parseo y validación de respuesta, actualizar tarea y `aiCalculated=true`.
- Criterios de aceptación: Llamada funciona con API key (si disponible), botón muestra "Calculando…" y inputs se deshabilitan; en error muestra toast sin cambiar valores.

8) Confirm/Toast UX, polish and docs
- Propósito: Añadir `ConfirmModal`, `Toast`, accesibilidad y documentación mínima.
- Entregable: `ConfirmModal.tsx`, `Toast.tsx`, `README.md` (ya creado), `design/architecture.md` (ya creado).
- Criterios de aceptación: Confirmaciones al eliminar / marcar como hecha / recalcular IA; toasts informativos; accesibilidad básica (labels, roles).

---

Notas:
- Cada tarea debe incluir tests unitarios mínimos para `ice.ts` y lógica de `TaskService` cuando sea posible.
- Preferir pequeñas PRs por tarea para facilitar revisiones.

