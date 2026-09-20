import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import resumeReducer from "@/lib/resume/redux/resumeSlice";
import settingsReducer from "@/lib/resume/redux/settingsSlice";
import type { RootState } from "@/lib/resume/redux/store";

export function setupTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      resume: resumeReducer,
      settings: settingsReducer,
    },
    preloadedState: preloadedState as any,
  });
}

export type AppStore = ReturnType<typeof setupTestStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react";
