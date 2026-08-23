"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { hydrate, loadFromLocalStorage } from "./cartSlice";

export function ReduxProvider({ children }) {
  useEffect(() => {
    const data = loadFromLocalStorage();
    if (data) {
      store.dispatch(hydrate(data));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
