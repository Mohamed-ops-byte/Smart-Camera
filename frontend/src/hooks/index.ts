import { useCallback, useEffect, useRef, useState } from 'react';

// Hook لإدارة تحديث البيانات بشكل دوري
export const usePolling = (callback: () => void | Promise<void>, interval = 5000) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const executeCallback = async () => {
      try {
        await callback();
      } catch (error) {
        console.error('خطأ في الاستدعاء الدوري:', error);
      }
    };

    executeCallback();
    intervalRef.current = setInterval(executeCallback, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval]);

  return {
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
  };
};

// Hook لإدارة Debounce
export const useDebouncedValue = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Hook لإدارة الكاميرا المحددة
export const useSelectedCamera = (cameraId?: string) => {
  const [selectedId, setSelectedId] = useState<string | null>(cameraId || null);

  const selectCamera = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const deselectCamera = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    selectCamera,
    deselectCamera,
  };
};

// Hook لإدارة الحالات المرئية (Modals, Dropdowns, etc)
export const useToggle = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close,
    setIsOpen,
  };
};

// Hook لإدارة البحث والفلترة
export const useFilteredData = <T,>(
  data: T[],
  searchTerm: string,
  filterFn: (item: T, term: string) => boolean
): T[] => {
  return data.filter((item) => filterFn(item, searchTerm.toLowerCase()));
};

// Hook لإدارة صفحة البيانات
export const usePagination = (items: unknown[], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedItems = items.slice(startIdx, endIdx);

  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
  };
};

// Hook لاستخدام الكاميرا
export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('خطأ في بدء الكاميرا:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureFrame = useCallback((): Blob | null => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    let blob: Blob | null = null;
    canvas.toBlob((b) => {
      blob = b;
    }, 'image/jpeg', 0.9);

    return blob;
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    startCamera,
    stopCamera,
    captureFrame,
  };
};

// Hook لقراءة الملفات
export const useFileReader = () => {
  const readFile = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('فشل في قراءة الملف'));
          }
        };
        reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
        reader.readAsDataURL(file);
      });
    },
    []
  );

  return { readFile };
};
