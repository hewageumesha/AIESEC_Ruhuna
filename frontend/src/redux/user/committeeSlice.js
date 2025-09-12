import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCommittee = createAsyncThunk('committee/fetchCommittee', async () => {
  const response = await axios.get('https://aiesecruhuna-production.up.railway.app/api/committee');
  return response.data;
});

export const addMember = createAsyncThunk('committee/addMember', async (memberData) => {
  const response = await axios.post('https://aiesecruhuna-production.up.railway.app/api/committee', memberData);
  return response.data;
});

export const updateMember = createAsyncThunk('committee/updateMember', async ({ id, ...data }) => {
  const response = await axios.put('https://aiesecruhuna-production.up.railway.app/apicommittee/${id}', data);
  return response.data;
});

export const deleteMember = createAsyncThunk('committee/deleteMember', async (id) => {
  await axios.delete('https://aiesecruhuna-production.up.railway.app/api/committee/${id}');
  return id;
});

const committeeSlice = createSlice({
  name: 'committee',
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommittee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommittee.fulfilled, (state, action) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchCommittee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m._id !== action.payload);
      });
  },
});

export default committeeSlice.reducer;
