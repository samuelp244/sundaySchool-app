// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

export const assessmentSlice = createSlice({
  name: 'classAssessment',
  initialState: {
    assessmentArray: [],
  },
  reducers: {
    initiateArray: (state,action) => {
      state.assessmentArray = action.payload
    },
    updateArray: (state,action) => {
    state.assessmentArray = state.assessmentArray.map(obj=> action.payload.find(o=>o.uniqueID === obj.uniqueID)|| obj);

    },
    deleteArray: (state) => {
      state.assessmentArray = []
    },
  },
})




export const { initiateArray, updateArray, deleteArray } = assessmentSlice.actions

export default assessmentSlice.reducer;