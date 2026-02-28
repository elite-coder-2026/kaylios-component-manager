import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

const initial = {
  params: { q: "", page: 1, limit: 20, framework: "all" },
  status: "idle", // idle | loading | success | error
  data: null,
  error: null,
  cache: new Map(), // key -> data
  lastUpdatedAt: null
};

function keyOf(params) {
  return JSON.stringify(params);
}

function reducer(state, action) {
  switch (action.type) {
    case "PARAMS_SET":
      return { ...state, params: { ...state.params, ...action.patch }, error: null };

    case "LOAD_FROM_CACHE": {
      return {
        ...state,
        status: "success",
        data: action.data,
        error: null,
        lastUpdatedAt: Date.now()
      };
    }

    case "FETCH_START":
      return { ...state, status: "loading", error: null };

    case "FETCH_SUCCESS": {
      const nextCache = new Map(state.cache);
      nextCache.set(action.cacheKey, action.data);
      return {
        ...state,
        status: "success",
        data: action.data,
        error: null,
        cache: nextCache,
        lastUpdatedAt: Date.now()
      };
    }

    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.error };

    case "HYDRATE":
      return { ...state, ...action.state };

    default:
      return state;
  }
}

export function useAdvancedSearch({ storageKey = "search_state_v1" } = {}) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Hydrate persisted params once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.params) dispatch({ type: "HYDRATE", state: { params: parsed.params } });
    } catch {
      // ignore bad storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist params (not full cache) when they change.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ params: state.params }));
    } catch {
      // ignore quota/blocked
    }
  }, [state.params, storageKey]);

  // Debounce the query only (page/framework changes should fetch immediately).
  const debouncedQ = useDebouncedValue(state.params.q, 250);

  const effectiveParams = useMemo(
    () => ({ ...state.params, q: debouncedQ }),
    [state.params, debouncedQ]
  );

  // Abortable fetch + race protection.
  const seqRef = useRef(0);

  useEffect(() => {
    const cacheKey = keyOf(effectiveParams);

    const cached = state.cache.get(cacheKey);
    if (cached) {
      dispatch({ type: "LOAD_FROM_CACHE", data: cached });
      return;
    }

    const seq = ++seqRef.current;
    const ac = new AbortController();

    dispatch({ type: "FETCH_START" });

    const url = new URL("http://localhost:4173/api/components/search");
    url.searchParams.set("q", effectiveParams.q || "");
    if (effectiveParams.framework && effectiveParams.framework !== "all") {
      url.searchParams.set("framework", effectiveParams.framework);
    }
    url.searchParams.set("limit", String(effectiveParams.limit));
    url.searchParams.set("page", String(effectiveParams.page)); // API may not support this; example only

    (async () => {
      try {
        const res = await fetch(url.toString(), { signal: ac.signal });
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.ok) throw new Error(body?.error || `Request failed (${res.status})`);

        // Ignore out-of-date responses.
        if (seq !== seqRef.current) return;

        dispatch({ type: "FETCH_SUCCESS", cacheKey, data: body });
      } catch (e) {
        if (ac.signal.aborted) return;
        if (seq !== seqRef.current) return;
        dispatch({ type: "FETCH_ERROR", error: e instanceof Error ? e.message : String(e) });
      }
    })();

    return () => ac.abort();
  }, [effectiveParams, state.cache]);

  return {
    state,
    setParams: (patch) => dispatch({ type: "PARAMS_SET", patch }),
    resetCache: () => dispatch({ type: "HYDRATE", state: { cache: new Map() } })
  };
}

export function SearchPanel() {
  const { state, setParams } = useAdvancedSearch();

  return (
    <div>
      <input
        value={state.params.q}
        onChange={(e) => setParams({ q: e.target.value, page: 1 })}
        placeholder="Search…"
      />
      <select
        value={state.params.framework}
        onChange={(e) => setParams({ framework: e.target.value, page: 1 })}
      >
        <option value="all">All</option>
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="vanilla">Vanilla</option>
      </select>

      {state.status === "loading" && <p>Loading…</p>}
      {state.status === "error" && <p style={{ color: "crimson" }}>{state.error}</p>}
      {state.status === "success" && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
    </div>
  );
}
