import type { StateCreator } from "./index";

export interface PersistOptions<T, PersistedState = T> {
  name: string;
  getStorage?: () => Storage | undefined;
  partialize?: (state: T) => PersistedState;
  serialize?: (state: PersistedState) => string;
  deserialize?: (str: string) => PersistedState | { state: PersistedState };
}

export function persist<T, PersistedState = T>(
  config: StateCreator<T>,
  options: PersistOptions<T, PersistedState>
): StateCreator<T>;

export default persist;