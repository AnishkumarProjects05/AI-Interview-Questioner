import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "@/lib/resume/redux/resumeSlice";
import settingsReducer from "@/lib/resume/redux/settingsSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


