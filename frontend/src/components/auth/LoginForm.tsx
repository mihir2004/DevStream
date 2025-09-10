import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Terminal, GitBranch } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { loginUser, clearError } from '@/store/slices/authSlice';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    dispatch(loginUser({ username, password }));
  };

  const handleDemoLogin = () => {
    setUsername('mihir');
    setPassword('12345678');
    dispatch(loginUser({ username: 'mihir', password: '12345678' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-success/5" />
      
      <Card className="w-full max-w-md relative shadow-card border-border/50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <Terminal className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              DevOps Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to manage your CI/CD pipelines
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-destructive/30">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-smooth focus:shadow-glow/50"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-smooth focus:shadow-glow/50"
                disabled={loading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 transition-smooth shadow-glow text-primary-foreground font-medium"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-success/30 text-success hover:bg-success/5 transition-smooth"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Try Demo (mihir / 12345678)
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            For production use, connect your backend API via REACT_APP_API_URL
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;