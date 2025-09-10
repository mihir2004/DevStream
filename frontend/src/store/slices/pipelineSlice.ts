import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
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
  status: 'pending' | 'running' | 'success' | 'failed';
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
  id: 'repo-broly',
  name: 'Broly',
  url: 'https://github.com/mihir2004/broly',
  branch: 'main',
  totalRuns: 12,
  successfulRuns: 11,
  failedRuns: 1,
};

const mockPipeline: Pipeline = {
  id: 'pipeline-broly-latest',
  name: 'Build & Deploy',
  repository: 'Broly',
  branch: 'main',
  status: 'success',
  triggeredBy: 'mihir',
  triggeredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  totalDuration: '4m 25s',
  stages: [
    {
      id: 'build',
      name: 'Build',
      status: 'success',
      duration: '2m 30s',
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 27.5).toISOString(),
      logs: [
        '[2024-01-15 10:30:00] Starting build process...',
        '[2024-01-15 10:30:05] Installing dependencies...',
        '[2024-01-15 10:31:20] Building React application...',
        '[2024-01-15 10:32:15] Build completed successfully!',
      ],
    },
    {
      id: 'test',
      name: 'Test',
      status: 'success',
      duration: '45s',
      startTime: new Date(Date.now() - 1000 * 60 * 27.5).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 26.75).toISOString(),
      logs: [
        '[2024-01-15 10:32:30] Running test suite...',
        '[2024-01-15 10:32:45] ✓ Unit tests passed (15/15)',
        '[2024-01-15 10:33:00] ✓ Integration tests passed (5/5)',
        '[2024-01-15 10:33:15] All 20 tests passed!',
      ],
    },
    {
      id: 'deploy',
      name: 'Deploy',
      status: 'success',
      duration: '1m 10s',
      startTime: new Date(Date.now() - 1000 * 60 * 26.75).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 25.58).toISOString(),
      logs: [
        '[2024-01-15 10:33:30] Deploying to production...',
        '[2024-01-15 10:34:15] Uploading build artifacts...',
        '[2024-01-15 10:34:30] Updating load balancer...',
        '[2024-01-15 10:34:40] Deployment completed successfully!',
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
  'pipeline/fetchPipelines',
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pipelines`, {
      headers: {
        Authorization: `Bearer ${state.auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pipelines');
    }

    return await response.json();
  }
);

const pipelineSlice = createSlice({
  name: 'pipeline',
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
        state.error = action.error.message || 'Failed to fetch pipelines';
      });
  },
});

export const { setCurrentPipeline, clearError } = pipelineSlice.actions;
export default pipelineSlice.reducer;