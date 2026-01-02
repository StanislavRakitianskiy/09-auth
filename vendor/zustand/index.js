const { useDebugValue, useSyncExternalStore } = require("react");

const isFunction = (value) => typeof value === "function";

const createImpl = (createState) => {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = isFunction(partial) ? partial(state) : partial;

    if (nextState !== state) {
      const previousState = state;
      state =
        replace || typeof nextState !== "object"
          ? nextState
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destroy = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destroy };

  state = createState(setState, getState, api);

  const useBoundStore = (selector = (s) => s, equalityFn = Object.is) => {
    const getSnapshot = () => selector(state);

    const subscribeWithSelector = (listener) =>
      subscribe((nextState, previousState) => {
        const nextSlice = selector(nextState);
        const prevSlice = selector(previousState);

        if (!equalityFn(nextSlice, prevSlice)) {
          listener(nextSlice, prevSlice);
        }
      });

    const slice = useSyncExternalStore(
      subscribeWithSelector,
      getSnapshot,
      getSnapshot
    );

    useDebugValue(slice);
    return slice;
  };

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

const create = (createState) => {
  return createState ? createImpl(createState) : createImpl;
};

module.exports = create;
module.exports.create = create;
module.exports.createStore = createImpl;