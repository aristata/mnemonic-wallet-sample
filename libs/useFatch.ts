import { useState } from "react";

interface UseFatchState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseFatchResult<T> = [(data?: any) => void, UseFatchState<T>];

export default function useFatch<T = any>(
  method: "GET" | "POST" | "UPDATE" | "DELETE",
  url: string
): UseFatchResult<T> {
  const [state, setState] = useState<UseFatchState<T>>({
    loading: false,
    data: undefined,
    error: undefined
  });
  function fatch(data?: any) {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [fatch, { ...state }];
}
