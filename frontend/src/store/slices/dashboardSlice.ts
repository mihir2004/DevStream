import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

// Utility to generate live recent execution data
const generateRecentExecutions = () => {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(now.getDate() - (6 - i)); // last 7 days ending today
    const isoDate = date.toISOString().split("T")[0];

    // Add random variation for mock data realism
    const successful = Math.floor(Math.random() * 5);
    const failed = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;

    return { date: isoDate, successful, failed };
  });
};

// Generate mock data dynamically
const mockStats: DashboardStats = {
  activePipelines: 3,
  successRate: 91.6,
  avgExecutionTime: "4m 25s",
  totalRuns: 0, // will compute below
  recentExecutions: generateRecentExecutions(),
};

// Compute total runs based on generated executions
mockStats.totalRuns = mockStats.recentExecutions.reduce(
  (sum, d) => sum + d.successful + d.failed,
  0
);

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { getState }) => {
    const state = getState() as any;
    const user = state.auth.user;

    //Return live mock data for mihir user
    if (user?.isMockUser) {
      return mockStats;
    }

    // Otherwise fetch real API data
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/analytics/stats`,
      {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return await response.json();
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
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
        state.error = action.error.message || "Failed to fetch dashboard stats";
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
