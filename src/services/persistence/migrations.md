# Migrations / Notas para migración de persistencia

Cuando se migre de `localStorage` a una implementación remota (por ejemplo `httpAdapter` → backend con PostgreSQL), siga este flujo sugerido:

1. Añadir `httpAdapter.ts` que implemente `IPersistenceAdapter`.
2. Probar endpoint del backend con un adapter temporal.
3. Opción A (cliente): escribir un script de migración en la app que lea `localStorage` y haga `POST` a `/api/migrate` del backend.
4. Opción B (manual): exportar `localStorage` en JSON y usar herramienta del backend para importar.
5. Una vez importados los datos al backend, cambiar la exportación en `factory.ts` para usar `httpAdapter`.

Notas:
- Mantener backups antes de migrar.
- Asegurar compatibilidad de esquema: `Task` debe mapearse 1:1 con la tabla/JSON del backend.
- Considerar idempotencia del script de migración.
