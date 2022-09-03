
import { createSlice } from '@reduxjs/toolkit'
export const authSlice = createSlice({
    name: 'userAuth',
    initialState:{
      user:null,
      token: null,
      refreshToken:null,
      role:null,
      isLoggedIn: false
    },
    reducers:{
      setCredentials:(state,action)=>{
        const {user,accessToken,refreshToken,isLoggedIn,userRole} = action.payload;
        state.user = user
        state.token = accessToken
        state.refreshToken = refreshToken
        state.isLoggedIn = isLoggedIn
        state.role = userRole
      },
      updateAccessToken:(state,action)=>{
        const {accessToken} = action.payload;
        state.token = accessToken
      },
      logOut:(state)=>{
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isLoggedIn = false
        state.role = null
      }
    }
  })

  export const {setCredentials,  updateAccessToken, logOut} = authSlice.actions;

  export default authSlice.reducer;

  // export const selectCurrentUser = (state) => state.userAuth.user;
  // export const selectCurrentToken = (state) => state.userAuth.token;
  // export const verify 