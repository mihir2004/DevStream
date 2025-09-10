import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Play, 
  Clock, 
  User, 
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { RootState } from '@/store';
import PipelineTimeline from '@/components/dashboard/PipelineTimeline';

const Pipelines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { pipelines, repositories } = useSelector((state: RootState) => state.pipeline);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock additional pipelines for demo
  const mockPipelines = [
    {
      id: 'pipeline-1',
      name: 'Build & Deploy',
      repository: 'Broly',
      branch: 'main',
      status: 'success' as const,
      triggeredBy: 'mihir',
      triggeredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      totalDuration: '4m 25s',
      stages: []
    },
    {
      id: 'pipeline-2',
      name: 'Feature Branch CI',
      repository: 'Broly',
      branch: 'feature/websocket-integration',
      status: 'running' as const,
      triggeredBy: 'mihir',
      triggeredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      totalDuration: '2m 30s',
      stages: []
    },
    {
      id: 'pipeline-3',
      name: 'Security Scan',
      repository: 'Broly',
      branch: 'main',
      status: 'failed' as const,
      triggeredBy: 'automated',
      triggeredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      totalDuration: '1m 15s',
      stages: []
    },
    {
      id: 'pipeline-4',
      name: 'Nightly Build',
      repository: 'API-Backend',
      branch: 'develop',
      status: 'success' as const,
      triggeredBy: 'scheduler',
      triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      totalDuration: '6m 42s',
      stages: []
    }
  ];

  const allPipelines = user?.isMockUser ? mockPipelines : pipelines;
  
  const filteredPipelines = allPipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.repository.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || pipeline.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-success/30 text-success bg-success/10';
      case 'failed':
        return 'border-destructive/30 text-destructive bg-destructive/10';
      case 'running':
        return 'border-warning/30 text-warning bg-warning/10 pulse-glow';
      default:
        return 'border-muted/30 text-muted-foreground bg-muted/10';
    }
  };

  const triggerPipeline = (pipelineId: string) => {
    console.log('Triggering pipeline:', pipelineId);
    // This would connect to your backend API
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Pipelines
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor your CI/CD pipelines
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pipelines or repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'running' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('running')}
          >
            <Loader2 className="w-3 h-3 mr-1" />
            Running
          </Button>
          <Button
            variant={selectedFilter === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('success')}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Button>
          <Button
            variant={selectedFilter === 'failed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('failed')}
          >
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Pipeline List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredPipelines.map((pipeline) => (
            <Card key={pipeline.id} className="shadow-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(pipeline.status)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{pipeline.name}</span>
                        <Badge variant="outline" className="text-xs">
                          #{pipeline.id.split('-')[1] || '1'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <GitBranch className="w-3 h-3" />
                        <span>{pipeline.repository}/{pipeline.branch}</span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(pipeline.status)}>
                      {pipeline.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>Triggered by {pipeline.triggeredBy}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(pipeline.triggeredAt).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Duration: {pipeline.totalDuration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => triggerPipeline(pipeline.id)}
                    className="gradient-primary text-primary-foreground"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Trigger Run
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          {filteredPipelines
            .filter(p => p.stages && p.stages.length > 0)
            .map((pipeline) => (
              <PipelineTimeline key={pipeline.id} pipeline={pipeline} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pipelines;