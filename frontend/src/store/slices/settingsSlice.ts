import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces
export interface ProfileSettings {
  username: string;
  email: string;
  fullName: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  timezone: string;
}

export interface SecuritySettings {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pipelineAlerts: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  slackIntegration: boolean;
  discordWebhook: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
}

interface SettingsState {
  profile: ProfileSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  apiKeys: ApiKey[];
}

// Helper: Load from localStorage
const loadSettings = (): SettingsState | null => {
  try {
    const data = localStorage.getItem("userSettings");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Helper: Save to localStorage (omit sensitive passwords)
const saveSettings = (settings: SettingsState) => {
  try {
    const { security, ...rest } = settings;
    const sanitizedSecurity = { ...security };
    delete sanitizedSecurity.currentPassword;
    delete sanitizedSecurity.newPassword;
    delete sanitizedSecurity.confirmPassword;

    localStorage.setItem(
      "userSettings",
      JSON.stringify({ ...rest, security: sanitizedSecurity })
    );
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
};

// Default state (fallback)
const defaultState: SettingsState = {
  profile: {
    username: "MihirK",
    email: "kasaremihir2004@gmail.com",
    fullName: "Mihir Kasare",
    bio: "I made this Awesome Dashboard",
    location: "Mumbai",
    website: "https://mihirkasare.vercel.app/",
    phone: "+91 9136724826",
    timezone: "India",
  },
  security: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: "24",
    loginAlerts: true,
  },
  notifications: {
    emailNotifications: true,
    pipelineAlerts: true,
    securityAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
    slackIntegration: false,
    discordWebhook: false,
  },
  apiKeys: [
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
  ],
};

// Load persisted settings if available
const initialState: SettingsState = loadSettings() || defaultState;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ProfileSettings>>) => {
      state.profile = { ...state.profile, ...action.payload };
      saveSettings(state);
    },
    updateSecurity: (
      state,
      action: PayloadAction<Partial<SecuritySettings>>
    ) => {
      state.security = { ...state.security, ...action.payload };
      saveSettings(state);
    },
    updateNotifications: (
      state,
      action: PayloadAction<Partial<NotificationSettings>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
      saveSettings(state);
    },
    addApiKey: (state, action: PayloadAction<ApiKey>) => {
      state.apiKeys.push(action.payload);
      saveSettings(state);
    },
    revokeApiKey: (state, action: PayloadAction<string>) => {
      state.apiKeys = state.apiKeys.filter((key) => key.id !== action.payload);
      saveSettings(state);
    },
    resetSettings: () => {
      saveSettings(defaultState);
      return defaultState;
    },
  },
});

export const {
  updateProfile,
  updateSecurity,
  updateNotifications,
  addApiKey,
  revokeApiKey,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
