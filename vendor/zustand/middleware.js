const getDefaultStorage = () => {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
};

const persist = (config, options) => {
  const { name, getStorage, partialize, serialize, deserialize } = options;

  return (set, get, api) => {
    const storage = (getStorage ?? getDefaultStorage)();

    const setWithPersist = (partial, replace) => {
      set(partial, replace);

      if (!storage || !name) return;

      try {
        const currentState = partialize ? partialize(get()) : get();
        const value = serialize
          ? serialize(currentState)
          : JSON.stringify(currentState);
        storage.setItem(name, value);
      } catch {
        // Ignore storage errors to avoid breaking UX
      }
    };

    let state = config(setWithPersist, get, api);

    if (storage && name) {
      try {
        const storedValue = storage.getItem(name);

        if (storedValue) {
          const parsed = deserialize
            ? deserialize(storedValue)
            : JSON.parse(storedValue);
          const nextState =
            parsed && typeof parsed === "object" && "state" in parsed
              ? parsed.state
              : parsed;

          if (nextState && typeof nextState === "object") {
            state = Object.assign({}, state, nextState);
            set(state, true);
          }
        }
      } catch {
        // Ignore hydration errors
      }
    }

    api.persist = {
      clearStorage: () => {
        if (storage && name) storage.removeItem(name);
      },
      rehydrate: () => {
        if (!storage || !name) return;
        const stored = storage.getItem(name);
        if (!stored) return;
        try {
          const parsed = deserialize
            ? deserialize(stored)
            : JSON.parse(stored);
          const nextState =
            parsed && typeof parsed === "object" && "state" in parsed
              ? parsed.state
              : parsed;
          if (nextState) set(nextState, true);
        } catch {
          // ignore
        }
      },
    };

    return state;
  };
};

module.exports = { persist };
module.exports.default = persist;