import localStorageAdapter from './localStorageAdapter';
import type { IPersistenceAdapter } from './adapter';

// Por defecto la app usa localStorage. Cambia aquí para usar `httpAdapter` cuando haya backend.
const defaultAdapter: IPersistenceAdapter = localStorageAdapter;

export default defaultAdapter;
export { localStorageAdapter };
