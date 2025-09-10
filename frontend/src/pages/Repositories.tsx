import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FolderGit, 
  ExternalLink, 
  GitBranch, 
  Settings as SettingsIcon,
  Plus,
  Webhook,
  Shield,
  Bell,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { RootState } from '@/store';
import RepositoryCard from '@/components/dashboard/RepositoryCard';

const Repositories: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const { repositories } = useSelector((state: RootState) => state.pipeline);
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock additional repositories for demo
  const mockRepositories = [
    {
      id: 'repo-broly',
      name: 'Broly',
      url: 'https://github.com/mihir2004/broly',
      branch: 'main',
      totalRuns: 12,
      successfulRuns: 11,
      failedRuns: 1,
      webhookEnabled: true,
      autoDeployEnabled: true,
      lastSync: new Date().toISOString(),
      contributors: 3,
      language: 'JavaScript'
    },
    {
      id: 'repo-api',
      name: 'API-Backend',
      url: 'https://github.com/mihir2004/api-backend',
      branch: 'develop',
      totalRuns: 25,
      successfulRuns: 23,
      failedRuns: 2,
      webhookEnabled: true,
      autoDeployEnabled: false,
      lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      contributors: 5,
      language: 'Node.js'
    },
    {
      id: 'repo-frontend',
      name: 'Dashboard-UI',
      url: 'https://github.com/mihir2004/dashboard-ui',
      branch: 'main',
      totalRuns: 8,
      successfulRuns: 7,
      failedRuns: 1,
      webhookEnabled: false,
      autoDeployEnabled: false,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      contributors: 2,
      language: 'React'
    }
  ];

  const allRepositories = user?.isMockUser ? mockRepositories : repositories;
  const selectedRepository = allRepositories.find(repo => repo.id === selectedRepo);

  const updateWebhook = (repoId: string, enabled: boolean) => {
    console.log('Updating webhook for', repoId, 'to', enabled);
    // This would connect to your backend API
  };

  const updateAutoDeploy = (repoId: string, enabled: boolean) => {
    console.log('Updating auto-deploy for', repoId, 'to', enabled);
    // This would connect to your backend API
  };

  const syncRepository = (repoId: string) => {
    console.log('Syncing repository', repoId);
    // This would connect to your backend API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Repositories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage connected repositories and their configurations
          </p>
        </div>
        
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Connect Repository
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allRepositories.map((repo) => (
              <Card 
                key={repo.id} 
                className="shadow-card hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedRepo(repo.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <FolderGit className="w-4 h-4" />
                        <span className="truncate">{repo.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(repo.url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {repo.language || 'JavaScript'}
                        </Badge>
                        <span>•</span>
                        <GitBranch className="w-3 h-3" />
                        <span>{repo.branch}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="font-medium">
                          {((repo.successfulRuns / repo.totalRuns) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">{repo.contributors || 0}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Contributors</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Last sync: {new Date(repo.lastSync || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {repo.webhookEnabled && (
                      <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/10">
                        Webhook Active
                      </Badge>
                    )}
                    {repo.autoDeployEnabled && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
                        Auto Deploy
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {selectedRepository ? (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="w-4 h-4" />
                  <span>{selectedRepository.name} Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure build and deployment settings for this repository
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Auto Deploy</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically deploy successful builds to production
                      </p>
                    </div>
                    <Switch
                      checked={selectedRepository.autoDeployEnabled}
                      onCheckedChange={(checked) => updateAutoDeploy(selectedRepository.id, checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Default Branch</Label>
                    <Input
                      id="branch"
                      value={selectedRepository.branch}
                      placeholder="main"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildCommand">Build Command</Label>
                    <Input
                      id="buildCommand"
                      placeholder="npm run build"
                      defaultValue="npm run build"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputDir">Output Directory</Label>
                    <Input
                      id="outputDir"
                      placeholder="dist"
                      defaultValue="dist"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="gradient-primary text-primary-foreground">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => syncRepository(selectedRepository.id)}>
                    Sync Repository
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <SettingsIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a repository from the Overview tab to configure its settings</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid gap-4">
            {allRepositories.map((repo) => (
              <Card key={repo.id} className="shadow-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Webhook className="w-4 h-4" />
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={repo.webhookEnabled 
                          ? "border-success/30 text-success bg-success/10" 
                          : "border-muted/30 text-muted-foreground bg-muted/10"
                        }
                      >
                        {repo.webhookEnabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <Switch
                      checked={repo.webhookEnabled}
                      onCheckedChange={(checked) => updateWebhook(repo.id, checked)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Webhook URL</Label>
                    <Input
                      readOnly
                      value={`https://api.devops-dashboard.com/webhooks/${repo.id}`}
                      className="font-mono text-xs"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secret configured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bell className="w-3 h-3" />
                      <span>Push events enabled</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Test Webhook
                    </Button>
                    <Button variant="outline" size="sm">
                      View Deliveries
                    </Button>
                    <Button variant="outline" size="sm">
                      Regenerate Secret
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Repositories;