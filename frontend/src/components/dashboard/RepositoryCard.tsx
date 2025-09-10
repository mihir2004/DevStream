import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExternalLink, GitBranch, Calendar, TrendingUp } from 'lucide-react';
import { Repository } from '@/store/slices/pipelineSlice';

interface RepositoryCardProps {
  repository: Repository;
  className?: string;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, className }) => {
  const successRate = repository.totalRuns > 0 
    ? ((repository.successfulRuns / repository.totalRuns) * 100).toFixed(1)
    : '0';

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'border-success/30 text-success bg-success/10';
      case 'failed':
        return 'border-destructive/30 text-destructive bg-destructive/10';
      case 'running':
        return 'border-warning/30 text-warning bg-warning/10';
      default:
        return 'border-muted/30 text-muted-foreground bg-muted/10';
    }
  };

  return (
    <Card className={cn("shadow-card hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span className="truncate">{repository.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => window.open(repository.url, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </CardTitle>
            <CardDescription className="flex items-center space-x-1 mt-1">
              <GitBranch className="w-3 h-3" />
              <span>{repository.branch}</span>
            </CardDescription>
          </div>
          
          {repository.lastRun && (
            <Badge 
              variant="outline" 
              className={getStatusColor(repository.lastRun.status)}
            >
              {repository.lastRun.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Last Run Info */}
        {repository.lastRun && (
          <div className="rounded-lg border border-border/30 p-3 bg-muted/20">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Last Run</span>
              <span className="text-muted-foreground">
                {repository.lastRun.totalDuration}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{new Date(repository.lastRun.triggeredAt).toLocaleString()}</span>
              <span>•</span>
              <span>by {repository.lastRun.triggeredBy}</span>
            </div>
          </div>
        )}
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold">{repository.totalRuns}</div>
            <div className="text-xs text-muted-foreground">Total Runs</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-lg font-bold text-success">{repository.successfulRuns}</div>
            <div className="text-xs text-muted-foreground">Successful</div>
          </div>
          
          <div className="space-y-1 flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-lg font-bold">{successRate}%</span>
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>
        
        {/* WhatsApp Bot Badge */}
        {repository.name.toLowerCase().includes('broly') && (
          <div className="flex justify-center pt-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
              WhatsApp Bot Project
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;