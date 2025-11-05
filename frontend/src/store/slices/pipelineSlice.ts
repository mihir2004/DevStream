import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface PipelineStage {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failed";
  duration?: string;
  startTime?: string;
  endTime?: string;
  logs?: string[];
}

export interface Pipeline {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: "pending" | "running" | "success" | "failed";
  stages: PipelineStage[];
  totalDuration?: string;
  triggeredBy?: string;
  triggeredAt: string;
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastRun?: Pipeline;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  webhookEnabled?: boolean;
  autoDeployEnabled?: boolean;
  lastSync?: string;
  contributors?: number;
  language?: string;
}

interface PipelineState {
  pipelines: Pipeline[];
  repositories: Repository[];
  currentPipeline: Pipeline | null;
  loading: boolean;
  error: string | null;
}

// Mock data for mihir user
const mockRepository: Repository = {
  id: "repo-broly",
  name: "Broly",
  url: "https://github.com/mihir2004/broly",
  branch: "main",
  totalRuns: 12,
  successfulRuns: 11,
  failedRuns: 1,
};

// Utility to format a timestamp like [2025-11-05 14:32:10]
const formatLogTimestamp = (offsetMinutes: number) => {
  const date = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `[${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}]`;
};

const mockPipeline: Pipeline = {
  id: "pipeline-broly-latest",
  name: "Build & Deploy",
  repository: "Broly",
  branch: "main",
  status: "success",
  triggeredBy: "mihir",
  triggeredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  totalDuration: "4m 25s",
  stages: [
    {
      id: "build",
      name: "Build",
      status: "success",
      duration: "2m 30s",
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 27.5).toISOString(),
      logs: [
        `${formatLogTimestamp(30)} Starting build process...`,
        `${formatLogTimestamp(29.9)} Installing dependencies...`,
        `${formatLogTimestamp(28.5)} Building React application...`,
        `${formatLogTimestamp(27.75)} Build completed successfully!`,
      ],
    },
    {
      id: "test",
      name: "Test",
      status: "success",
      duration: "45s",
      startTime: new Date(Date.now() - 1000 * 60 * 27.5).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 26.75).toISOString(),
      logs: [
        `${formatLogTimestamp(27.5)} Running test suite...`,
        `${formatLogTimestamp(27.25)} ✓ Unit tests passed (15/15)`,
        `${formatLogTimestamp(27)} ✓ Integration tests passed (5/5)`,
        `${formatLogTimestamp(26.8)} All 20 tests passed!`,
      ],
    },
    {
      id: "deploy",
      name: "Deploy",
      status: "success",
      duration: "1m 10s",
      startTime: new Date(Date.now() - 1000 * 60 * 26.75).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 25.58).toISOString(),
      logs: [
        `${formatLogTimestamp(26.75)} Deploying to production...`,
        `${formatLogTimestamp(26.5)} Uploading build artifacts...`,
        `${formatLogTimestamp(26.25)} Updating load balancer...`,
        `${formatLogTimestamp(25.9)} Deployment completed successfully!`,
      ],
    },
  ],
};

mockRepository.lastRun = mockPipeline;

const initialState: PipelineState = {
  pipelines: [],
  repositories: [],
  currentPipeline: null,
  loading: false,
  error: null,
};

export const fetchPipelines = createAsyncThunk(
  "pipeline/fetchPipelines",
  async (_, { getState }) => {
    const state = getState() as any;
    const user = state.auth.user;

    // Return mock data for mihir user
    if (user?.isMockUser) {
      return {
        pipelines: [mockPipeline],
        repositories: [mockRepository],
      };
    }

    // Real API call for other users
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/pipelines`,
      {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pipelines");
    }

    return await response.json();
  }
);

const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    setCurrentPipeline: (state, action) => {
      state.currentPipeline = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines = action.payload.pipelines || [];
        state.repositories = action.payload.repositories || [];
      })
      .addCase(fetchPipelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch pipelines";
      });
  },
});

export const { setCurrentPipeline, clearError } = pipelineSlice.actions;
export default pipelineSlice.reducer;
