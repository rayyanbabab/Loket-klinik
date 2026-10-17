import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Types
export interface QueueData {
  service: string;
  current: string | null;
  counter: string | null;
  next: string[];
  total_waiting: number; // Add total waiting count
  current_ticket: string | null;
  current_counter: string | null;
  called_at: number | null;
}

export interface QueueStatus {
  services: QueueData[];
  timestamp: number;
}

export interface Ticket {
  id: number;
  number_str: string;
  service_id: number;
  status: string;
  called_at?: string;
  counter_id?: number;
  created_at: string;
}

export interface Counter {
  id: number;
  name: string;
  service: {
    id: number;
    name: string;
  };
}

export interface Service {
  id: number;
  name: string;
  code: string;
  prefix: string;
}

export interface DashboardStats {
  total_today: number;
  done_today: number;
  currently_serving: number;
  waiting: number;
  avg_service_time: number;
  services: Array<{
    id: number;
    name: string;
    total_today: number;
    done_today: number;
    waiting: number;
    serving: number;
  }>;
  counters: Array<{
    id: number;
    name: string;
    done_today: number;
    serving: number;
    service: {
      id: number;
      name: string;
    };
  }>;
}

export interface GlobalStats {
  done_today: number;
  currently_serving: number;
  waiting: number;
}

// Module-level shared caches for instantaneous zero-latency page transitions
let memoryCachedStatus: QueueStatus | null = null;
let memoryCachedServices: Service[] | null = null;
let memoryCachedCounters: Counter[] | null = null;
let memoryCachedDashboardStats: DashboardStats | null = null;
let memoryCachedGlobalStats: GlobalStats | null = null;

const getSessionCache = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

const setSessionCache = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

// Custom hook for queue status with instant hydration, deduplication & visibility-aware polling
export function useQueueStatus(pollingInterval: number = 5000) {
  const initialCache = useMemo(() => memoryCachedStatus || getSessionCache<QueueStatus>('queue_status_cache'), []);
  const [data, setData] = useState<QueueStatus | null>(initialCache);
  const [loading, setLoading] = useState<boolean>(!initialCache);
  const [error, setError] = useState<string | null>(null);

  const prevServicesJsonRef = useRef<string>(initialCache ? JSON.stringify(initialCache.services) : '');
  const isFetchingRef = useRef<boolean>(false);

  const fetchQueueStatus = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch('/api/status', {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch queue status');
      }
      const result: QueueStatus = await response.json();

      // Bandingkan apakah data layanan benar-benar berubah untuk mencegah render berlebih
      const currentServicesJson = JSON.stringify(result.services);
      if (currentServicesJson !== prevServicesJsonRef.current) {
        prevServicesJsonRef.current = currentServicesJson;
        setData(result);
        memoryCachedStatus = result;
        setSessionCache('queue_status_cache', result);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            fetchQueueStatus();
          }
        }, pollingInterval);
      }
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchQueueStatus();
        startPolling();
      } else {
        stopPolling();
      }
    };

    fetchQueueStatus();
    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchQueueStatus, pollingInterval]);

  return { data, loading, error, refetch: fetchQueueStatus };
}

// Custom hook for queue management actions
export function useQueueActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCSRFToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  };

  const callNext = useCallback(async (counterId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/call/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        },
        body: JSON.stringify({ counter_id: counterId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to call next ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const recall = useCallback(async (ticketId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/call/${ticketId}/recall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to recall ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const finish = useCallback(async (ticketId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/call/${ticketId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to finish ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTicket = useCallback(async (serviceId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken(),
          'Accept': 'application/json'
        },
        body: JSON.stringify({ service_id: serviceId })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to generate ticket';

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
        }

        console.error('Generate ticket error:', errorMessage);
        throw new Error(errorMessage);
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Generate ticket exception:', err);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    callNext,
    recall,
    finish,
    generateTicket,
    loading,
    error,
    clearError: () => setError(null)
  };
}

// Custom hook for services with instant memory & session cache
export function useServices() {
  const initialServices = useMemo(() => memoryCachedServices || getSessionCache<Service[]>('services_cache') || [], []);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(!initialServices.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services', {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data: Service[] = await response.json();
          if (isMounted) {
            setServices(data);
            memoryCachedServices = data;
            setSessionCache('services_cache', data);
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted && !services.length) {
          // Fallback to mock data if API not available
          const mockServices: Service[] = [
            { id: 1, name: 'Poli Umum', code: 'POLI-UMUM', prefix: 'A' },
            { id: 2, name: 'Poli Gigi', code: 'POLI-GIGI', prefix: 'B' },
            { id: 3, name: 'Farmasi', code: 'FARMASI', prefix: 'C' },
            { id: 4, name: 'Poli KIA', code: 'POLI-KIA', prefix: 'D' },
          ];
          setServices(mockServices);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => { isMounted = false; };
  }, []);

  return { services, loading, error };
}

// Custom hook for counters with instant memory & session cache
export function useCounters() {
  const initialCounters = useMemo(() => memoryCachedCounters || getSessionCache<Counter[]>('counters_cache') || [], []);
  const [counters, setCounters] = useState<Counter[]>(initialCounters);
  const [loading, setLoading] = useState(!initialCounters.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCounters = async () => {
      try {
        const response = await fetch('/api/counters', {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data: Counter[] = await response.json();
          if (isMounted) {
            setCounters(data);
            memoryCachedCounters = data;
            setSessionCache('counters_cache', data);
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted && !counters.length) {
          const mockCounters: Counter[] = [
            { id: 1, name: 'Loket 1', service: { id: 1, name: 'Poli Umum' } },
            { id: 2, name: 'Loket Gigi', service: { id: 2, name: 'Poli Gigi' } },
            { id: 3, name: 'Loket Farmasi', service: { id: 3, name: 'Farmasi' } },
            { id: 4, name: 'Loket KIA', service: { id: 4, name: 'Poli KIA' } },
          ];
          setCounters(mockCounters);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCounters();
    return () => { isMounted = false; };
  }, []);

  return { counters, loading, error };
}

// Custom hook for current ticket at a counter
export function useCurrentTicket(counterId: number | null) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchCurrentTicket = useCallback(async (id: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/counter/${id}/current`, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const ticket = await response.json();
        setCurrentTicket(ticket);
      } else if (response.status === 404) {
        setCurrentTicket(null);
      } else {
        throw new Error('Failed to fetch current ticket');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCurrentTicket(null);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (counterId) {
      fetchCurrentTicket(counterId);
    } else {
      setCurrentTicket(null);
    }
  }, [counterId, fetchCurrentTicket]);

  return {
    currentTicket,
    loading,
    error,
    refetch: counterId ? () => fetchCurrentTicket(counterId) : () => { }
  };
}

// Custom hook for notifications
export function useNotifications() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
}

// Custom hook for sound system
export function useSoundSystem() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('queueSoundEnabled') !== 'false';
  });

  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('queueSoundVolume') || '0.7');
  });

  // Sound System Class
  const soundSystem = useMemo(() => {
    class QueueSoundSystem {
      private speechSynth: SpeechSynthesis | null = null;
      private voice: SpeechSynthesisVoice | null = null;
      private bellSound: HTMLAudioElement | null = null;

      constructor() {
        this.initSoundSystem();
      }

      initSoundSystem() {
        if ('speechSynthesis' in window) {
          this.speechSynth = window.speechSynthesis;

          const setVoice = () => {
            const voices = this.speechSynth!.getVoices();
            this.voice = voices.find(voice => voice.lang.includes('id')) ||
              voices.find(voice => voice.lang.includes('en')) ||
              voices[0];
          };

          if (this.speechSynth.getVoices().length > 0) {
            setVoice();
          } else {
            this.speechSynth.onvoiceschanged = setVoice;
          }
        }

        // Create bell sound
        this.bellSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBjiR2O+OOggZZbPs44cAAA==');
        this.updateVolume(volume);
      }

      updateVolume(newVolume: number) {
        if (this.bellSound) {
          this.bellSound.volume = newVolume;
        }
      }

      async playTicketCall(ticketNumber: string, serviceName: string, counterName: string) {
        if (!isEnabled) return;

        try {
          // Play bell sound first
          if (this.bellSound) {
            await this.bellSound.play();
            setTimeout(() => {
              this.speakTicketCall(ticketNumber, serviceName, counterName);
            }, 1000);
          } else {
            this.speakTicketCall(ticketNumber, serviceName, counterName);
          }
        } catch (error) {
          console.error('Error playing bell sound:', error);
          setTimeout(() => {
            this.speakTicketCall(ticketNumber, serviceName, counterName);
          }, 500);
        }
      }

      speakTicketCall(ticketNumber: string, serviceName: string, counterName: string) {
        if (!this.speechSynth || !this.voice) return;

        this.speechSynth.cancel();

        setTimeout(() => {
          const text = `Nomor antrian ${ticketNumber}, layanan ${serviceName}, silakan menuju ${counterName}`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = this.voice;
          utterance.volume = volume;
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.lang = 'id-ID';

          this.speechSynth!.speak(utterance);
        }, 500);
      }
    }

    return new QueueSoundSystem();
  }, []);

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem('queueSoundEnabled', isEnabled.toString());
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('queueSoundVolume', volume.toString());
    soundSystem.updateVolume(volume);
  }, [volume, soundSystem]);

  const playTicketCall = useCallback((ticketNumber: string, serviceName: string, counterName: string) => {
    soundSystem.playTicketCall(ticketNumber, serviceName, counterName);
  }, [soundSystem]);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  const testSound = useCallback((ticketNumber: string = 'A-001', serviceName: string = 'Poli Umum', counterName: string = 'Loket 1') => {
    soundSystem.playTicketCall(ticketNumber, serviceName, counterName);
  }, [soundSystem]);

  return {
    isEnabled,
    volume,
    playTicketCall,
    testSound,
    toggleSound,
    updateVolume
  };
}

// Custom hook for counter statistics
export function useCounterStats(counterId: number | null) {
  const [stats, setStats] = useState<{
    done_today: number;
    currently_serving: number;
    waiting: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchStats = useCallback(async (id: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/counter/${id}/stats`, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Failed to fetch counter stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStats(null);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!counterId) {
      setStats(null);
      return;
    }

    let interval: NodeJS.Timeout | null = null;
    const startPolling = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            fetchStats(counterId);
          }
        }, 15000);
      }
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats(counterId);
        startPolling();
      } else {
        stopPolling();
      }
    };

    fetchStats(counterId);
    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [counterId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: counterId ? () => fetchStats(counterId) : () => { }
  };
}

// Custom hook for dashboard statistics with instant cache & visibility awareness
export function useDashboardStats(pollingInterval: number = 10000) {
  const initialCache = useMemo(() => memoryCachedDashboardStats || getSessionCache<DashboardStats>('dashboard_stats_cache'), []);
  const [stats, setStats] = useState<DashboardStats | null>(initialCache);
  const [loading, setLoading] = useState<boolean>(!initialCache);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data: DashboardStats = await response.json();
        setStats(data);
        memoryCachedDashboardStats = data;
        setSessionCache('dashboard_stats_cache', data);
        setError(null);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            fetchStats();
          }
        }, pollingInterval);
      }
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
        startPolling();
      } else {
        stopPolling();
      }
    };

    fetchStats();
    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchStats, pollingInterval]);

  return { stats, loading, error, refetch: fetchStats };
}

// Custom hook for global statistics (for display page) with instant cache & visibility awareness
export function useGlobalStats(pollingInterval: number = 10000) {
  const initialCache = useMemo(() => memoryCachedGlobalStats || getSessionCache<GlobalStats>('global_stats_cache'), []);
  const [stats, setStats] = useState<GlobalStats | null>(initialCache);
  const [loading, setLoading] = useState<boolean>(!initialCache);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await fetch('/api/global/stats', {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data: GlobalStats = await response.json();
        setStats(data);
        memoryCachedGlobalStats = data;
        setSessionCache('global_stats_cache', data);
        setError(null);
      } else {
        throw new Error('Failed to fetch global stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            fetchStats();
          }
        }, pollingInterval);
      }
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
        startPolling();
      } else {
        stopPolling();
      }
    };

    fetchStats();
    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchStats, pollingInterval]);

  return { stats, loading, error, refetch: fetchStats };
}
