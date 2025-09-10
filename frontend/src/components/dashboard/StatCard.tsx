import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/30 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning':
        return 'border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'destructive':
        return 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10';
      default:
        return 'border-border/50 gradient-card';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'destructive':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg shadow-card",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          getIconStyles()
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        
        {description && (
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        )}
        
        {trend && (
          <div className="flex items-center space-x-1 mt-2">
            <Badge 
              variant={trend.direction === 'up' ? 'outline' : 'destructive'}
              className={cn(
                "text-xs",
                trend.direction === 'up' 
                  ? "border-success/30 text-success bg-success/10" 
                  : "border-destructive/30 text-destructive bg-destructive/10"
              )}
            >
              {trend.direction === 'up' ? '↗' : '↘'} {Math.abs(trend.value)}%
            </Badge>
            <span className="text-xs text-muted-foreground">{trend.period}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;