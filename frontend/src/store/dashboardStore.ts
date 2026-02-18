import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Camera, Person, SystemSettings, DashboardState } from '@/types';
import ApiService from '@/services/api';

interface DashboardStore {
  // البيانات
  cameras: Camera[];
  persons: Person[];
  detections: any[];
  alerts: any[];
  settings: any[];
  schedules: any[];
  loading: boolean;
  error: string | null;

  // الكاميرات
  fetchCameras: () => Promise<void>;
  addCamera: (camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCamera: (id: string | number, camera: Partial<Camera>) => Promise<void>;
  deleteCamera: (id: string | number) => Promise<void>;

  // الأشخاص
  fetchPersons: () => Promise<void>;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePerson: (id: string | number, person: Partial<Person>) => Promise<void>;
  deletePerson: (id: string | number) => Promise<void>;

  // الكشف والتنبيهات
  fetchDetections: (filters?: Record<string, any>) => Promise<void>;
  fetchAlerts: (filters?: Record<string, any>) => Promise<void>;
  acknowledgeAlert: (id: string | number) => Promise<void>;

  // الإعدادات والجدولة
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: any) => Promise<void>;
  fetchSchedules: () => Promise<void>;
  createSchedule: (schedule: any) => Promise<void>;
  updateSchedule: (id: string | number, schedule: any) => Promise<void>;
  deleteSchedule: (id: string | number) => Promise<void>;

  // الأدوات العامة
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      cameras: [],
      persons: [],
      detections: [],
      alerts: [],
      settings: [],
      schedules: [],
      loading: false,
      error: null,

      // ==================== الكاميرات ====================
      fetchCameras: async () => {
        set({ loading: true });
        try {
          const cameras = await ApiService.getCameras();
          set({ cameras, error: null });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب الكاميرات' });
        } finally {
          set({ loading: false });
        }
      },

      addCamera: async (camera) => {
        try {
          const newCamera = await ApiService.createCamera(camera);
          set((state) => ({ cameras: [...state.cameras, newCamera] }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في إضافة الكاميرا' });
          throw error;
        }
      },

      updateCamera: async (id, camera) => {
        try {
          const updated = await ApiService.updateCamera(id, camera);
          set((state) => ({
            cameras: state.cameras.map((c) => (c.id === updated.id ? updated : c))
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في تحديث الكاميرا' });
          throw error;
        }
      },

      deleteCamera: async (id) => {
        try {
          await ApiService.deleteCamera(id);
          set((state) => ({
            cameras: state.cameras.filter((c) => c.id !== id)
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في حذف الكاميرا' });
          throw error;
        }
      },

      // ==================== الأشخاص ====================
      fetchPersons: async () => {
        set({ loading: true });
        try {
          const persons = await ApiService.getPersons();
          set({ persons, error: null });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب الأشخاص' });
        } finally {
          set({ loading: false });
        }
      },

      addPerson: async (person) => {
        try {
          const newPerson = await ApiService.createPerson(person);
          set((state) => ({ persons: [...state.persons, newPerson] }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في إضافة الشخص' });
          throw error;
        }
      },

      updatePerson: async (id, person) => {
        try {
          const updated = await ApiService.updatePerson(id, person);
          set((state) => ({
            persons: state.persons.map((p) => (p.id === updated.id ? updated : p))
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في تحديث الشخص' });
          throw error;
        }
      },

      deletePerson: async (id) => {
        try {
          await ApiService.deletePerson(id);
          set((state) => ({
            persons: state.persons.filter((p) => p.id !== id)
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في حذف الشخص' });
          throw error;
        }
      },

      // ==================== الكشف والتنبيهات ====================
      fetchDetections: async (filters) => {
        try {
          const detections = await ApiService.getDetections(filters);
          set({ detections });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب الاكتشافات' });
        }
      },

      fetchAlerts: async (filters) => {
        try {
          const alerts = await ApiService.getAlerts(filters);
          set({ alerts });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب التنبيهات' });
        }
      },

      acknowledgeAlert: async (id) => {
        try {
          const updated = await ApiService.acknowledgeAlert(id);
          set((state) => ({
            alerts: state.alerts.map((a) => (a.id === updated.id ? updated : a))
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في تأكيد التنبيه' });
          throw error;
        }
      },

      // ==================== الإعدادات والجدولة ====================
      fetchSettings: async () => {
        try {
          const settings = await ApiService.getSettings();
          set({ settings });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب الإعدادات' });
        }
      },

      updateSettings: async (settings) => {
        try {
          await ApiService.updateSettings(settings);
          set({ settings });
        } catch (error: any) {
          set({ error: error.message || 'فشل في تحديث الإعدادات' });
          throw error;
        }
      },

      fetchSchedules: async () => {
        try {
          const schedules = await ApiService.getSchedules();
          set({ schedules });
        } catch (error: any) {
          set({ error: error.message || 'فشل في جلب الجداول' });
        }
      },

      createSchedule: async (schedule) => {
        try {
          const newSchedule = await ApiService.createSchedule(schedule);
          set((state) => ({ schedules: [...state.schedules, newSchedule] }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في إنشاء جدول' });
          throw error;
        }
      },

      updateSchedule: async (id, schedule) => {
        try {
          const updated = await ApiService.updateSchedule(id, schedule);
          set((state) => ({
            schedules: state.schedules.map((s) => (s.id === updated.id ? updated : s))
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في تحديث الجدول' });
          throw error;
        }
      },

      deleteSchedule: async (id) => {
        try {
          await ApiService.deleteSchedule(id);
          set((state) => ({
            schedules: state.schedules.filter((s) => s.id !== id)
          }));
        } catch (error: any) {
          set({ error: error.message || 'فشل في حذف الجدول' });
          throw error;
        }
      },

      // ==================== الأدوات ====================
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    { name: 'dashboard-store' }
  )
);

export default useDashboardStore;
      detections: [],
      alerts: [],
      recordings: [],
      systemSettings: null,
      isLoading: false,
      error: null,

      // ========== الكاميرات ==========
      fetchCameras: async () => {
        try {
          set({ isLoading: true, error: null });
          const cameras = await apiService.getCameras();
          set({ cameras, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب الكاميرات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      addCamera: async (camera) => {
        try {
          set({ isLoading: true, error: null });
          const newCamera = await apiService.createCamera(camera);
          set((state) => ({
            cameras: [...state.cameras, newCamera],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الكاميرا';
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateCamera: async (id, camera) => {
        try {
          set({ isLoading: true, error: null });
          const updatedCamera = await apiService.updateCamera(id, camera);
          set((state) => ({
            cameras: state.cameras.map((c) => (c.id === id ? updatedCamera : c)),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الكاميرا';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteCamera: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiService.deleteCamera(id);
          set((state) => ({
            cameras: state.cameras.filter((c) => c.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الكاميرا';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== مجموعات الكاميرات ==========
      fetchCameraGroups: async () => {
        try {
          set({ isLoading: true, error: null });
          const cameraGroups = await apiService.getCameraGroups();
          set({ cameraGroups, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب مجموعات الكاميرات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      addCameraGroup: async (group) => {
        try {
          set({ isLoading: true, error: null });
          const newGroup = await apiService.createCameraGroup(group);
          set((state) => ({
            cameraGroups: [...state.cameraGroups, newGroup],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة المجموعة';
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateCameraGroup: async (id, group) => {
        try {
          set({ isLoading: true, error: null });
          const updatedGroup = await apiService.updateCameraGroup(id, group);
          set((state) => ({
            cameraGroups: state.cameraGroups.map((cg) => (cg.id === id ? updatedGroup : cg)),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث المجموعة';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteCameraGroup: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiService.deleteCameraGroup(id);
          set((state) => ({
            cameraGroups: state.cameraGroups.filter((cg) => cg.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف المجموعة';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== الأشخاص ==========
      fetchPersons: async () => {
        try {
          set({ isLoading: true, error: null });
          const persons = await apiService.getPersons();
          set({ persons, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب الأشخاص';
          set({ error: errorMessage, isLoading: false });
        }
      },

      addPerson: async (person) => {
        try {
          set({ isLoading: true, error: null });
          const newPerson = await apiService.addPerson(person);
          set((state) => ({
            persons: [...state.persons, newPerson],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الشخص';
          set({ error: errorMessage, isLoading: false });
        }
      },

      updatePerson: async (id, person) => {
        try {
          set({ isLoading: true, error: null });
          const updatedPerson = await apiService.updatePerson(id, person);
          set((state) => ({
            persons: state.persons.map((p) => (p.id === id ? updatedPerson : p)),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الشخص';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deletePerson: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiService.deletePerson(id);
          set((state) => ({
            persons: state.persons.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الشخص';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== الكشف والتنبيهات ==========
      fetchDetections: async (filters) => {
        try {
          set({ isLoading: true, error: null });
          const detections = await apiService.getDetections(filters);
          set({ detections, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب الكشف';
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchAlerts: async (filters) => {
        try {
          set({ isLoading: true, error: null });
          const alerts = await apiService.getAlerts(filters);
          set({ alerts, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب التنبيهات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      acknowledgeAlert: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const updatedAlert = await apiService.acknowledgeAlert(id);
          set((state) => ({
            alerts: state.alerts.map((a) => (a.id === id ? updatedAlert : a)),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في تأكيد التنبيه';
          set({ error: errorMessage, isLoading: false });
        }
      },

      resolveAlert: async (id, actions) => {
        try {
          set({ isLoading: true, error: null });
          const updatedAlert = await apiService.resolveAlert(id, actions);
          set((state) => ({
            alerts: state.alerts.map((a) => (a.id === id ? updatedAlert : a)),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في حل التنبيه';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== التسجيلات ==========
      fetchRecordings: async (filters) => {
        try {
          set({ isLoading: true, error: null });
          const recordings = await apiService.getRecordings(filters);
          set({ recordings, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب التسجيلات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteRecording: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiService.deleteRecording(id);
          set((state) => ({
            recordings: state.recordings.filter((r) => r.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف التسجيل';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== الإعدادات ==========
      fetchSystemSettings: async () => {
        try {
          set({ isLoading: true, error: null });
          const systemSettings = await apiService.getSystemSettings();
          set({ systemSettings, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في جلب الإعدادات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      updateSystemSettings: async (settings) => {
        try {
          set({ isLoading: true, error: null });
          const updatedSettings = await apiService.updateSystemSettings(settings);
          set({ systemSettings: updatedSettings, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الإعدادات';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // ========== الأدوات ==========
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    })
  )
);

export default useDashboardStore;
