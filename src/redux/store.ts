
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AssessmentReducer from './classAssessment';
import AuthReducer from './authSlice'
import { loadState } from './browserStorage';




const reducers = combineReducers({
    assessment:AssessmentReducer,
    auth:AuthReducer
})

export const store = configureStore({
  devTools: true,
  reducer: reducers,
  preloadedState: loadState()
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
