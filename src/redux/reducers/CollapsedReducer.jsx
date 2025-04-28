import { createSlice } from '@reduxjs/toolkit';

const collapsedSlice = createSlice({
  name: 'collapsed',
  initialState: {
    value: false,
  },
  reducers: {
    toggleCollapsed: (state) => {
      state.value = !state.value;
    },
    setCollapsed: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleCollapsed, setCollapsed } = collapsedSlice.actions;
export default collapsedSlice.reducer;