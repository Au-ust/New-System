import { createSlice } from '@reduxjs/toolkit';

const Loading = createSlice({
  name: 'isLoading',
  initialState: {
    value: false,
  },
  reducers: {
    change_loading: (state) => {
      state.value = !state.value;
    },
    default_loading: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { change_loading, default_loading } = Loading.actions
export default Loading.reducer;