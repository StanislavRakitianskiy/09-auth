export type StateListener<T> = (state: T, previousState: T) => void;

export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export type GetState<T> = () => T;

export interface StoreApi<T> {
  setState: SetState<T>;
  getState: GetState<T>;
  subscribe: (listener: StateListener<T>) => () => void;
  destroy: () => void;
}

export type StateCreator<T> = (
  setState: SetState<T>,
  getState: GetState<T>,
  api: StoreApi<T>
) => T;

export interface UseBoundStore<T> extends StoreApi<T> {
  (): T;
  <U>(selector: (state: T) => U, equalityFn?: (a: U, b: U) => boolean): U;
}

export default function create<T>(
  createState: StateCreator<T>
): UseBoundStore<T>;
export function create<T>(): (createState: StateCreator<T>) => UseBoundStore<T>;
export function createStore<T>(
  createState: StateCreator<T>
): UseBoundStore<T>;