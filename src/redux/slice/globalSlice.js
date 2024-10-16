import {createSlice} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    isDarkTheme: true,
  },
  reducers: {
    setMode: (state, action) => {
      state.isDarkTheme = action.payload; // Directly mutate the state
    },
  },
});

export const {setMode} = globalSlice.actions;
export default globalSlice.reducer;
