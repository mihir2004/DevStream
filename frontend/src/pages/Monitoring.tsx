import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { SimpleLineChart } from '@/components/charts/SimpleChart';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
  lastCheck: string;
}

const Monitoring: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
    { name: 'Memory Usage', value: 68, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disk Usage', value: 32, unit: '%', status: 'healthy', trend: 'down' },
    { name: 'Network I/O', value: 156, unit: 'Mbps', status: 'healthy', trend: 'stable' }
  ]);

  const [services] = useState<ServiceStatus[]>([
    {
      name: 'API Gateway',
      status: 'online',
      uptime: '99.9%',
      responseTime: 45,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      responseTime: 12,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Redis Cache',
      status: 'online',
      uptime: '99.9%',
      responseTime: 3,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'File Storage',
      status: 'degraded',
      uptime: '98.5%',
      responseTime: 230,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Email Service',
      status: 'offline',
      uptime: '95.2%',
      responseTime: 0,
      lastCheck: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
  ]);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'degraded':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'offline':
      case 'critical':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'border-success/30 text-success bg-success/10';
      case 'degraded':
      case 'warning':
        return 'border-warning/30 text-warning bg-warning/10';
      case 'offline':
      case 'critical':
        return 'border-destructive/30 text-destructive bg-destructive/10';
      default:
        return 'border-muted/30 text-muted-foreground bg-muted/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-warning" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-success" />;
      default:
        return null;
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cpu usage':
        return Cpu;
      case 'memory usage':
        return MemoryStick;
      case 'disk usage':
        return HardDrive;
      case 'network i/o':
        return Wifi;
      default:
        return Activity;
    }
  };

  // Mock performance data
  const performanceData = [
    { date: '00:00', cpu: 35, memory: 60, network: 120 },
    { date: '04:00', cpu: 28, memory: 55, network: 95 },
    { date: '08:00', cpu: 45, memory: 70, network: 180 },
    { date: '12:00', cpu: 52, memory: 75, network: 220 },
    { date: '16:00', cpu: 48, memory: 68, network: 190 },
    { date: '20:00', cpu: 42, memory: 65, network: 160 },
    { date: '24:00', cpu: 38, memory: 62, network: 140 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          System Monitoring
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health, performance metrics, and service status
        </p>
      </div>

      {/* System Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Services Online"
          value={`${services.filter(s => s.status === 'online').length}/${services.length}`}
          icon={Server}
          description="Active services"
          variant="success"
        />
        
        <StatCard
          title="Avg Response Time"
          value="45ms"
          icon={Zap}
          description="API response time"
          variant="default"
          trend={{ value: 12, direction: 'down', period: 'vs last hour' }}
        />
        
        <StatCard
          title="System Uptime"
          value="99.8%"
          icon={Activity}
          description="Last 30 days"
          variant="success"
        />
        
        <StatCard
          title="Active Alerts"
          value="2"
          icon={AlertTriangle}
          description="Requires attention"
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>System Metrics</span>
              </CardTitle>
              <CardDescription>Real-time system performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {systemMetrics.map((metric) => {
                  const IconComponent = getMetricIcon(metric.name);
                  return (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{metric.name}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(metric.status)}
                          <span>{metric.value}{metric.unit}</span>
                        </div>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className={`h-2 ${
                          metric.status === 'critical' ? 'bg-destructive/20' :
                          metric.status === 'warning' ? 'bg-warning/20' : 'bg-success/20'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <div className="h-80">
            <SimpleLineChart
              data={performanceData.map(d => ({ 
                date: d.date, 
                successful: d.cpu, 
                failed: d.memory 
              }))}
              title="Performance Trends"
              description="System performance over the last 24 hours"
            />
          </div>
        </div>

        {/* Service Status */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-4 h-4" />
                <span>Service Status</span>
              </CardTitle>
              <CardDescription>Health status of all services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-start justify-between p-3 rounded-lg border border-border/30 bg-muted/10">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(service.status)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>Uptime: {service.uptime}</span>
                        <span>•</span>
                        <span>{service.responseTime}ms</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Recent Alerts</span>
              </CardTitle>
              <CardDescription>Latest system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <div className="font-medium">High memory usage detected</div>
                    <div className="text-xs text-muted-foreground">5 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 text-sm">
                  <XCircle className="w-4 h-4 text-destructive mt-0.5" />
                  <div>
                    <div className="font-medium">Email service offline</div>
                    <div className="text-xs text-muted-foreground">15 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <div className="font-medium">Database backup completed</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;