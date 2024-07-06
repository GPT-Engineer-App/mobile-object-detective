import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  objects: [],
  count: 0,
};

const detectionSlice = createSlice({
  name: "detection",
  initialState,
  reducers: {
    setObjects: (state, action) => {
      state.objects = action.payload;
      state.count = action.payload.length;
    },
  },
});

export const { setObjects } = detectionSlice.actions;
export default detectionSlice.reducer;