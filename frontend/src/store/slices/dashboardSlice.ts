import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface DashboardStats {
  activePipelines: number;
  successRate: number;
  avgExecutionTime: string;
  totalRuns: number;
  recentExecutions: Array<{
    date: string;
    successful: number;
    failed: number;
  }>;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

// Mock analytics data for mihir user
const mockStats: DashboardStats = {
  activePipelines: 3,
  successRate: 91.6,
  avgExecutionTime: '4m 25s',
  totalRuns: 12,
  recentExecutions: [
    { date: '2024-01-15', successful: 3, failed: 0 },
    { date: '2024-01-14', successful: 2, failed: 1 },
    { date: '2024-01-13', successful: 4, failed: 0 },
    { date: '2024-01-12', successful: 2, failed: 0 },
    { date: '2024-01-11', successful: 1, failed: 0 },
    { date: '2024-01-10', successful: 0, failed: 0 },
    { date: '2024-01-09', successful: 0, failed: 0 },
  ],
};

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { getState }) => {
    const state = getState() as any;
    const user = state.auth.user;

    // Return mock data for mihir user
    if (user?.isMockUser) {
      return mockStats;
    }

    // Real API call for other users
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/stats`, {
      headers: {
        Authorization: `Bearer ${state.auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;