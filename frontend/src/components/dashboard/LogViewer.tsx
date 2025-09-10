import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Terminal, Play, Square, Download, Maximize2, Minimize2 } from 'lucide-react';

interface LogViewerProps {
  logs?: string[];
  title?: string;
  isLive?: boolean;
  className?: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ 
  logs = [], 
  title = "Pipeline Logs", 
  isLive = false,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(isLive);
  const [displayLogs, setDisplayLogs] = useState(logs);

  // Simulate live log streaming for demo
  useEffect(() => {
    if (isStreaming && isLive) {
      const interval = setInterval(() => {
        const newLog = `[${new Date().toLocaleTimeString()}] Processing... Step ${Math.floor(Math.random() * 100)}`;
        setDisplayLogs(prev => [...prev, newLog]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isStreaming, isLive]);

  const mockLogs = [
    '[2024-01-15 10:30:00] Starting build process...',
    '[2024-01-15 10:30:05] Installing dependencies...',
    '[2024-01-15 10:30:15] npm install completed successfully',
    '[2024-01-15 10:31:20] Building React application...',
    '[2024-01-15 10:31:45] Webpack build process started',
    '[2024-01-15 10:32:10] Assets optimized and minified',
    '[2024-01-15 10:32:15] ✅ Build completed successfully!',
    '[2024-01-15 10:32:30] Running test suite...',
    '[2024-01-15 10:32:45] ✓ Unit tests passed (15/15)',
    '[2024-01-15 10:33:00] ✓ Integration tests passed (5/5)',
    '[2024-01-15 10:33:15] ✅ All 20 tests passed!',
    '[2024-01-15 10:33:30] Deploying to production...',
    '[2024-01-15 10:34:15] Uploading build artifacts...',
    '[2024-01-15 10:34:30] Updating load balancer...',
    '[2024-01-15 10:34:40] ✅ Deployment completed successfully!',
  ];

  const finalLogs = displayLogs.length > 0 ? displayLogs : mockLogs;

  return (
    <Card className={cn(
      "shadow-card transition-all duration-300",
      isExpanded ? "fixed inset-4 z-50 bg-background" : "",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <CardTitle className="text-lg">{title}</CardTitle>
            {isLive && (
              <Badge 
                variant="outline" 
                className={cn(
                  "border-success/30 text-success bg-success/10",
                  isStreaming && "pulse-glow"
                )}
              >
                Live
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isLive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStreaming(!isStreaming)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isStreaming ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        <CardDescription>
          Real-time pipeline execution logs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className={cn(
          "w-full border border-border/30 rounded-lg",
          isExpanded ? "h-[calc(100vh-200px)]" : "h-64"
        )}>
          <div className="p-4 font-mono text-xs bg-muted/20">
            {finalLogs.map((log, index) => (
              <div 
                key={index} 
                className={cn(
                  "py-1 hover:bg-muted/30 transition-colors",
                  log.includes('✅') && "text-success",
                  log.includes('❌') && "text-destructive",
                  log.includes('⚠️') && "text-warning"
                )}
              >
                {log}
              </div>
            ))}
            
            {isStreaming && (
              <div className="py-1 text-muted-foreground animate-pulse">
                <span className="inline-block w-2 h-2 bg-current rounded-full mr-2 animate-bounce" />
                Streaming logs...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogViewer;