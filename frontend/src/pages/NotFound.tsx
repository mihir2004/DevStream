import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-6">
      <Card className="shadow-card max-w-md text-center">
        <CardHeader>
          <div className="flex flex-col items-center space-y-3">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              404
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Oops! The page you’re looking for doesn’t exist.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">
            You tried to visit{" "}
            <span className="font-mono text-foreground">
              {location.pathname}
            </span>
          </p>
          <Button asChild className="gradient-primary text-primary-foreground">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Go to Home Page
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
