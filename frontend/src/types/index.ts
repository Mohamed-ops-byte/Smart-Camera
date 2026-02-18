// أنواع الكاميرا والمراقبة
export interface Camera {
  id: string;
  name: string;
  location: string;
  deviceId?: string;
  status: 'online' | 'offline' | 'recording';
  resolutionWidth: number;
  resolutionHeight: number;
  frameRate: number;
  liveStreamUrl?: string;
  thumbnailUrl?: string;
  recordingEnabled: boolean;
  zoomLevel?: number;
  pan?: number;
  tilt?: number;
  createdAt: Date;
  lastSeen?: Date;
}

export interface CameraGroup {
  id: string;
  name: string;
  description?: string;
  cameraIds: string[];
  createdAt: Date;
}

export interface Person {
  id: string;
  name: string;
  type: 'resident' | 'visitor' | 'intruder';
  faceEmbedding?: number[];
  photoUrl?: string;
  phone?: string;
  email?: string;
  trustLevel: number; // 0-100
  createdAt: Date;
  lastSeen?: Date;
}

export interface Detection {
  id: string;
  cameraId: string;
  timestamp: Date;
  type: 'face' | 'motion' | 'person' | 'theft' | 'intrusion';
  confidence: number;
  detectedPerson?: {
    id: string;
    name: string;
    type: 'resident' | 'visitor' | 'intruder';
  };
  snapshotUrl?: string;
  videoClipUrl?: string;
  additionalData?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  type: 'intrusion' | 'theft' | 'motion' | 'offline' | 'unknown-person' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  cameraId?: string;
  detectionId?: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  actionsTaken?: string[];
}

export interface Recording {
  id: string;
  cameraId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // في الثواني
  fileSize: number; // بالميجابايت
  url?: string;
  thumbnailUrl?: string;
  motion: boolean;
  detections: Detection[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'viewer';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences?: Record<string, unknown>;
  createdAt: Date;
}

export interface SystemSettings {
  name: string;
  location: string;
  timezone: string;
  notificationSettings: {
    enableEmail: boolean;
    enablePush: boolean;
    enableSMS: boolean;
    alertLevels: string[];
  };
  recordingSettings: {
    continuousRecording: boolean;
    motionDetection: boolean;
    retentionDays: number;
  };
  aiSettings: {
    enableFaceRecognition: boolean;
    enableTheftDetection: boolean;
    enableMotionDetection: boolean;
    minConfidenceLevel: number;
  };
}

export interface DashboardState {
  cameras: Camera[];
  cameraGroups: CameraGroup[];
  persons: Person[];
  detections: Detection[];
  alerts: Alert[];
  recordings: Recording[];
  systemSettings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
}
