import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Camera, Person, Detection, Alert, Recording, SystemSettings } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private apiClient: AxiosInstance;
  private pythonServiceUrl: string;
  
  constructor(
    baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    pythonServiceUrl = import.meta.env.VITE_PYTHON_SERVICE_URL || 'http://localhost:5000/api'
  ) {
    this.apiClient = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.pythonServiceUrl = pythonServiceUrl;

    // إضافة معالج الأخطاء
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ==================== الكاميرات ====================
  
  async getCameras(): Promise<Camera[]> {
    const { data } = await this.apiClient.get<ApiResponse<Camera[]>>('/cameras');
    return data.data || [];
  }

  async getCameraById(id: string | number): Promise<Camera> {
    const { data } = await this.apiClient.get<ApiResponse<Camera>>(`/cameras/${id}`);
    return data.data!;
  }

  async createCamera(camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>): Promise<Camera> {
    const { data } = await this.apiClient.post<ApiResponse<Camera>>('/cameras', camera);
    return data.data!;
  }

  async updateCamera(id: string | number, camera: Partial<Camera>): Promise<Camera> {
    const { data } = await this.apiClient.put<ApiResponse<Camera>>(`/cameras/${id}`, camera);
    return data.data!;
  }

  async deleteCamera(id: string | number): Promise<void> {
    await this.apiClient.delete(`/cameras/${id}`);
  }

  async testCamera(id: string | number): Promise<boolean> {
    try {
      const response = await this.apiClient.post(`/cameras/${id}/test`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // ==================== الأشخاص والتعرف على الوجوه ====================

  async getPersons(): Promise<Person[]> {
    const { data } = await this.apiClient.get<ApiResponse<Person[]>>('/persons');
    return data.data || [];
  }

  async getPersonById(id: string | number): Promise<Person> {
    const { data } = await this.apiClient.get<ApiResponse<Person>>(`/persons/${id}`);
    return data.data!;
  }

  async createPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    const { data } = await this.apiClient.post<ApiResponse<Person>>('/persons', person);
    return data.data!;
  }

  async updatePerson(id: string | number, person: Partial<Person>): Promise<Person> {
    const { data } = await this.apiClient.put<ApiResponse<Person>>(`/persons/${id}`, person);
    return data.data!;
  }

  async deletePerson(id: string | number): Promise<void> {
    await this.apiClient.delete(`/persons/${id}`);
  }

  async addFaceImage(personId: string | number, image: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', image);
    const { data } = await this.apiClient.post(
      `/persons/${personId}/faces`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  }

  // ==================== الكشف والتنبيهات ====================

  async getDetections(filters?: {
    camera_id?: number;
    type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<Detection[]> {
    const { data } = await this.apiClient.get<ApiResponse<any>>('/detections', { params: filters });
    return data.data?.data || [];
  }

  async createDetection(detection: any): Promise<Detection> {
    const { data } = await this.apiClient.post<ApiResponse<Detection>>('/detections', detection);
    return data.data!;
  }

  async getDetectionStatistics(): Promise<any> {
    const { data } = await this.apiClient.get('/detections/statistics');
    return data.data;
  }

  // ==================== التنبيهات ====================

  async getAlerts(filters?: {
    severity?: string;
    acknowledged?: boolean;
  }): Promise<Alert[]> {
    const { data } = await this.apiClient.get<ApiResponse<any>>('/alerts', { 
      params: filters ? { ...filters, all: !filters.acknowledged } : {} 
    });
    return data.data?.data || [];
  }

  async createAlert(alert: any): Promise<Alert> {
    const { data } = await this.apiClient.post<ApiResponse<Alert>>('/alerts', alert);
    return data.data!;
  }

  async acknowledgeAlert(id: string | number): Promise<Alert> {
    const { data } = await this.apiClient.post<ApiResponse<Alert>>(`/alerts/${id}/acknowledge`);
    return data.data!;
  }

  async getUnacknowledgedAlerts(): Promise<Alert[]> {
    const { data } = await this.apiClient.get<ApiResponse<Alert[]>>('/alerts/unacknowledged');
    return data.data || [];
  }

  async deleteAlert(id: string | number): Promise<void> {
    await this.apiClient.delete(`/alerts/${id}`);
  }

  // ==================== الإعدادات ====================

  async getSettings(): Promise<any[]> {
    const { data } = await this.apiClient.get<ApiResponse<any[]>>('/settings');
    return data.data || [];
  }

  async updateSettings(settings: any): Promise<void> {
    await this.apiClient.put('/settings', settings);
  }

  async resetSettings(): Promise<void> {
    await this.apiClient.post('/settings/reset');
  }

  // ==================== الجدولة ====================

  async getSchedules(): Promise<any[]> {
    const { data } = await this.apiClient.get<ApiResponse<any[]>>('/schedules');
    return data.data || [];
  }

  async createSchedule(schedule: any): Promise<any> {
    const { data } = await this.apiClient.post<ApiResponse<any>>('/schedules', schedule);
    return data.data!;
  }

  async updateSchedule(id: string | number, schedule: any): Promise<any> {
    const { data } = await this.apiClient.put<ApiResponse<any>>(`/schedules/${id}`, schedule);
    return data.data!;
  }

  async deleteSchedule(id: string | number): Promise<void> {
    await this.apiClient.delete(`/schedules/${id}`);
  }

  async getActiveSchedules(): Promise<any[]> {
    const { data } = await this.apiClient.get<ApiResponse<any[]>>('/schedules/active');
    return data.data || [];
  }

  // ==================== خدمة Python للذكاء الاصطناعي ====================

  async recognizeFace(imagePath: string): Promise<any> {
    const response = await axios.post(`${this.pythonServiceUrl}/recognize`, {
      image_path: imagePath,
      camera_id: 1
    });
    return response.data;
  }

  async detectMotion(imagePath: string): Promise<any> {
    const response = await axios.post(`${this.pythonServiceUrl}/motion-detect`, {
      image_path: imagePath
    });
    return response.data;
  }

  async detectTheft(imagePath: string): Promise<any> {
    const response = await axios.post(`${this.pythonServiceUrl}/theft-detect`, {
      image_path: imagePath
    });
    return response.data;
  }

  async addPersonToAI(personId: number, personName: string, images: File[]): Promise<any> {
    const formData = new FormData();
    formData.append('person_id', personId.toString());
    formData.append('person_name', personName);
    images.forEach(img => formData.append('images', img));

    const response = await axios.post(`${this.pythonServiceUrl}/add-person`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getAIStatistics(): Promise<any> {
    const response = await axios.get(`${this.pythonServiceUrl}/statistics`);
    return response.data;
  }
}

export default new ApiService();

  }

  // ==================== التسجيلات ====================
    timeline: Array<{ timestamp: Date; count: number }>;
  }> {
    const { data } = await this.apiClient.get('/stats/detections', { params: { timeRange } });
    return data;
  }

  // ==================== البث المباشر والـ WebSocket ====================

  subscribeToAlerts(_callback: (alert: Alert) => void): () => void {
    // سيتم تنفيذ WebSocket في خدمة منفصلة
    return () => {};
  }

  subscribeToDetections(_cameraId: string, _callback: (detection: Detection) => void): () => void {
    // سيتم تنفيذ WebSocket في خدمة منفصلة
    return () => {};
  }
}

export const apiService = new ApiService();
export default ApiService;
