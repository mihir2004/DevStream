import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import { RootState, AppDispatch } from "@/store";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // Profile form state
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || `kasaremihir2004@gmail.com`,
    fullName: "Mihir Kasare",
    bio: "Full-stack developer passionate about DevOps and automation",
    location: "Mumbai, Maharashtra, IND",
    website: "https://mihirkasare.vercel.app/",
    phone: "+91 91367 24826",
    timezone: "India",
  });

  // Security settings state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: "24",
    loginAlerts: true,
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pipelineAlerts: true,
    securityAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
    slackIntegration: false,
    discordWebhook: false,
  });

  // API keys state
  const [apiKeys] = useState([
    {
      id: "1",
      name: "Production API Key",
      key: "pk_live_51H7...***...9Kj2",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      permissions: ["read", "write"],
    },
    {
      id: "2",
      name: "CI/CD Integration",
      key: "ci_test_41K2...***...8Xm1",
      created: "2024-01-10",
      lastUsed: "1 day ago",
      permissions: ["read"],
    },
  ]);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const saveProfile = () => {
    // In a real app, this would connect to your backend
    console.log("Saving profile:", profile);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const saveSecuritySettings = () => {
    if (
      security.newPassword &&
      security.newPassword !== security.confirmPassword
    ) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    console.log("Saving security settings:", security);
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const saveNotificationSettings = () => {
    console.log("Saving notification settings:", notifications);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const generateApiKey = () => {
    console.log("Generating new API key");
    toast({
      title: "API key generated",
      description:
        "Your new API key has been created. Make sure to copy it now.",
    });
  };

  const revokeApiKey = (keyId: string) => {
    console.log("Revoking API key:", keyId);
    toast({
      title: "API key revoked",
      description: "The API key has been permanently revoked.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and security settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src="/placeholder-avatar.jpg"
                    alt={profile.username}
                  />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-lg font-bold">
                    {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-3 h-3 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                  {user?.isMockUser && (
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/10"
                    >
                      Demo Account
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) =>
                      setProfile({ ...profile, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Greenwich Mean Time (GMT)
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        Japan Standard Time (JST)
                      </SelectItem>
                      <SelectItem value="India">
                        Indian Standart Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button
                onClick={saveProfile}
                className="gradient-primary text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change Password</h4>
                <div className="grid gap-4 md:grid-cols-1 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={security.currentPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={security.newPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={security.confirmPassword}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Security Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, twoFactorEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Login Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) =>
                        setSecurity({ ...security, loginAlerts: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (hours)
                    </Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) =>
                        setSecurity({ ...security, sessionTimeout: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                onClick={saveSecuritySettings}
                className="gradient-primary text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  {Object.entries({
                    emailNotifications: "All email notifications",
                    pipelineAlerts: "Pipeline status alerts",
                    securityAlerts: "Security alerts",
                    weeklyReports: "Weekly summary reports",
                    marketingEmails: "Marketing and promotional emails",
                  }).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{label}</Label>
                      </div>
                      <Switch
                        checked={
                          notifications[
                            key as keyof typeof notifications
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Integrations</h4>
                <div className="space-y-3">
                  {Object.entries({
                    pushNotifications: "Browser push notifications",
                    slackIntegration: "Slack notifications",
                    discordWebhook: "Discord webhook alerts",
                  }).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{label}</Label>
                      </div>
                      <Switch
                        checked={
                          notifications[
                            key as keyof typeof notifications
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={saveNotificationSettings}
                className="gradient-primary text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>API Keys</span>
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for external integrations
                  </CardDescription>
                </div>
                <Button
                  onClick={generateApiKey}
                  className="gradient-primary text-primary-foreground"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-muted/10"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{apiKey.name}</div>
                    <div className="font-mono text-xs text-muted-foreground mt-1">
                      {apiKey.key}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {apiKey.created}</span>
                      </div>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => revokeApiKey(apiKey.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
