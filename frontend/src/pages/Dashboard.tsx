import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import { fetchPipelines } from '@/store/slices/pipelineSlice';
import StatCard from '@/components/dashboard/StatCard';
import PipelineTimeline from '@/components/dashboard/PipelineTimeline';
import RepositoryCard from '@/components/dashboard/RepositoryCard';
import LogViewerEnhanced from '@/components/dashboard/LogViewerEnhanced';
import { SimpleLineChart, SimplePieChart } from '@/components/charts/SimpleChart';
import { Activity, GitBranch, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useSelector((state: RootState) => state.dashboard);
  const { pipelines, repositories, loading: pipelineLoading } = useSelector((state: RootState) => state.pipeline);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchPipelines());
  }, [dispatch]);

  useEffect(() => {
    if (user?.isMockUser) {
      toast({
        title: 'Welcome to DevOps Dashboard',
        description: 'Last pipeline executed successfully at ' + new Date().toLocaleTimeString(),
      });
    }
  }, [user, toast]);

  if (statsLoading || pipelineLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-lg border border-border/50 shimmer" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 bg-card rounded-lg border border-border/50 shimmer" />
          <div className="h-80 bg-card rounded-lg border border-border/50 shimmer" />
        </div>
      </div>
    );
  }

  const pieChartData = stats ? [
    { name: 'Successful', value: Math.round((stats.successRate / 100) * stats.totalRuns), color: 'hsl(var(--success))' },
    { name: 'Failed', value: stats.totalRuns - Math.round((stats.successRate / 100) * stats.totalRuns), color: 'hsl(var(--destructive))' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Pipeline Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your CI/CD pipelines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Pipelines"
          value={stats?.activePipelines || 0}
          icon={Activity}
          description="Currently running"
          variant="default"
        />
        
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon={TrendingUp}
          description="Last 30 days"
          variant="success"
          trend={{ value: 5.2, direction: 'up', period: 'vs last month' }}
        />
        
        <StatCard
          title="Avg Execution Time"
          value={stats?.avgExecutionTime || '0m'}
          icon={Clock}
          description="Pipeline duration"
          variant="default"
        />
        
        <StatCard
          title="Total Runs"
          value={stats?.totalRuns || 0}
          icon={GitBranch}
          description="All time executions"
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Pipeline Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {pipelines.length > 0 && (
            <PipelineTimeline 
              pipeline={pipelines[0]} 
            />
          )}
          
          {/* Execution History Chart */}
          {stats?.recentExecutions && (
            <SimpleLineChart
              data={stats.recentExecutions}
              title="Execution History"
              description="Daily pipeline runs over the past week"
            />
          )}

          {/* Enhanced Log Viewer */}
          <LogViewerEnhanced 
            title="Live Pipeline Logs"
            isLive={user?.isMockUser}
            logs={pipelines[0]?.stages[0]?.logs}
            pipelineId={pipelines[0]?.id}
          />
        </div>

        {/* Right Column - Repository & Analytics */}
        <div className="space-y-6">
          {/* Repository Card */}
          {repositories.length > 0 && (
            <RepositoryCard repository={repositories[0]} />
          )}
          
          {/* Success Rate Pie Chart */}
          {pieChartData.length > 0 && (
            <SimplePieChart
              data={pieChartData}
              title="Success vs Failed Runs"
              description="Overall pipeline execution results"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;