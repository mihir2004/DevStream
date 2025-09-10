import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Terminal, 
  Play, 
  Square, 
  Download, 
  Maximize2, 
  Minimize2,
  Search,
  Filter,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
}

interface LogViewerEnhancedProps {
  logs?: string[];
  title?: string;
  isLive?: boolean;
  className?: string;
  pipelineId?: string;
}

const LogViewerEnhanced: React.FC<LogViewerEnhancedProps> = ({ 
  logs = [], 
  title = "Pipeline Logs", 
  isLive = false,
  className,
  pipelineId = 'default'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(isLive);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [displayLogs, setDisplayLogs] = useState<LogEntry[]>([]);
  const [selectedStage, setSelectedStage] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert string logs to structured log entries
  useEffect(() => {
    const structuredLogs: LogEntry[] = logs.map((log, index) => {
      const timestampMatch = log.match(/\[(.*?)\]/);
      const timestamp = timestampMatch ? timestampMatch[1] : new Date().toLocaleTimeString();
      
      let level: LogEntry['level'] = 'info';
      if (log.includes('ERROR') || log.includes('❌') || log.includes('Failed')) level = 'error';
      else if (log.includes('WARN') || log.includes('⚠️') || log.includes('Warning')) level = 'warn';
      else if (log.includes('✅') || log.includes('SUCCESS') || log.includes('completed')) level = 'info';
      else if (log.includes('DEBUG')) level = 'debug';

      return {
        timestamp,
        level,
        message: log,
        source: getLogSource(log)
      };
    });

    setDisplayLogs(structuredLogs);
  }, [logs]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayLogs, isStreaming]);

  // Simulate live log streaming for demo
  useEffect(() => {
    if (isStreaming && isLive) {
      const interval = setInterval(() => {
        const newLogEntry: LogEntry = {
          timestamp: new Date().toLocaleTimeString(),
          level: Math.random() > 0.8 ? 'warn' : 'info',
          message: `[${new Date().toLocaleTimeString()}] ${getRandomLogMessage()}`,
          source: 'build'
        };
        
        setDisplayLogs(prev => [...prev, newLogEntry]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isStreaming, isLive]);

  const getLogSource = (message: string): string => {
    if (message.includes('build') || message.includes('Building')) return 'build';
    if (message.includes('test') || message.includes('Testing')) return 'test';
    if (message.includes('deploy') || message.includes('Deploying')) return 'deploy';
    return 'system';
  };

  const getRandomLogMessage = (): string => {
    const messages = [
      'Processing build step...',
      'Compiling source files...',
      'Running unit tests...',
      'Uploading artifacts...',
      'Updating deployment status...',
      'Cache invalidation complete',
      'Health check passed'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-3 h-3 text-destructive" />;
      case 'warn':
        return <AlertCircle className="w-3 h-3 text-warning" />;
      case 'info':
        return <CheckCircle className="w-3 h-3 text-success" />;
      case 'debug':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-destructive bg-destructive/10';
      case 'warn':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-success bg-success/10';
      case 'debug':
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const filteredLogs = displayLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesStage = selectedStage === 'all' || log.source === selectedStage;
    return matchesSearch && matchesLevel && matchesStage;
  });

  const downloadLogs = () => {
    const logContent = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-logs-${pipelineId}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stageLogs = {
    all: displayLogs,
    build: displayLogs.filter(log => log.source === 'build'),
    test: displayLogs.filter(log => log.source === 'test'),
    deploy: displayLogs.filter(log => log.source === 'deploy'),
    system: displayLogs.filter(log => log.source === 'system')
  };

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
            <Badge variant="outline" className="text-xs">
              {filteredLogs.length} entries
            </Badge>
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
              onClick={downloadLogs}
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
          Real-time pipeline execution logs with filtering and search
        </CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="build">Build</SelectItem>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="deploy">Deploy</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="unified" className="space-y-4">
          <TabsList>
            <TabsTrigger value="unified">Unified View</TabsTrigger>
            <TabsTrigger value="by-stage">By Stage</TabsTrigger>
          </TabsList>

          <TabsContent value="unified">
            <ScrollArea 
              ref={scrollRef}
              className={cn(
                "w-full border border-border/30 rounded-lg",
                isExpanded ? "h-[calc(100vh-300px)]" : "h-80"
              )}
            >
              <div className="p-4 font-mono text-xs bg-muted/20">
                {filteredLogs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No logs match your current filters</p>
                  </div>
                ) : (
                  filteredLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className="py-1 hover:bg-muted/30 transition-colors flex items-start space-x-2"
                    >
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {log.timestamp}
                      </span>
                      <div className="flex items-center">
                        {getLevelIcon(log.level)}
                      </div>
                      <Badge variant="outline" className={cn("text-xs px-1 py-0 h-4", getLevelColor(log.level))}>
                        {log.level}
                      </Badge>
                      {log.source && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                          {log.source}
                        </Badge>
                      )}
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))
                )}
                
                {isStreaming && (
                  <div className="py-1 text-muted-foreground animate-pulse flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" />
                    <span>Streaming logs...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="by-stage">
            <div className="space-y-4">
              {Object.entries(stageLogs).map(([stage, logs]) => {
                if (stage === 'all' || logs.length === 0) return null;
                
                return (
                  <Card key={stage} className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm capitalize flex items-center space-x-2">
                        <span>{stage}</span>
                        <Badge variant="outline" className="text-xs">
                          {logs.length} entries
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-40 w-full border border-border/30 rounded">
                        <div className="p-2 font-mono text-xs bg-muted/20">
                          {logs.slice(-10).map((log, index) => (
                            <div key={index} className="py-0.5 text-xs">
                              {log.message}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LogViewerEnhanced;