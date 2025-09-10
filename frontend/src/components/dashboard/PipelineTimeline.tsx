import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Play, ExternalLink } from 'lucide-react';
import { PipelineStage, Pipeline } from '@/store/slices/pipelineSlice';

interface PipelineTimelineProps {
  pipeline: Pipeline;
  className?: string;
}

const PipelineTimeline: React.FC<PipelineTimelineProps> = ({ pipeline, className }) => {
  const getStatusIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Play className="w-4 h-4 text-warning animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: PipelineStage['status']) => {
    switch (status) {
      case 'success':
        return 'border-success bg-success/10';
      case 'failed':
        return 'border-destructive bg-destructive/10';
      case 'running':
        return 'border-warning bg-warning/10 pulse-glow';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  const completedStages = pipeline.stages.filter(stage => stage.status === 'success').length;
  const totalStages = pipeline.stages.length;
  const progress = (completedStages / totalStages) * 100;

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{pipeline.name}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <span>{pipeline.repository}</span>
              <span>•</span>
              <span>{pipeline.branch}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-2",
                  pipeline.status === 'success' && "border-success/30 text-success bg-success/10",
                  pipeline.status === 'failed' && "border-destructive/30 text-destructive bg-destructive/10",
                  pipeline.status === 'running' && "border-warning/30 text-warning bg-warning/10"
                )}
              >
                {pipeline.status}
              </Badge>
            </CardDescription>
          </div>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress: {completedStages}/{totalStages} stages</span>
            <span>{pipeline.totalDuration}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {pipeline.stages.map((stage, index) => (
            <div key={stage.id} className="flex items-start space-x-3">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  getStatusColor(stage.status)
                )}>
                  {getStatusIcon(stage.status)}
                </div>
                {index < pipeline.stages.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-8 mt-2 transition-all duration-200",
                    stage.status === 'success' ? "bg-success" : "bg-muted"
                  )} />
                )}
              </div>
              
              {/* Stage content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{stage.name}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                      {stage.duration && (
                        <>
                          <span>Duration: {stage.duration}</span>
                          <span>•</span>
                        </>
                      )}
                      {stage.startTime && (
                        <span>Started: {new Date(stage.startTime).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                  
                  {stage.logs && stage.logs.length > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Logs
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineTimeline;