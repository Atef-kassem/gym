import React, { useState, useEffect, useRef } from 'react';
import { X, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackendStatusNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const BackendStatusNotification: React.FC<BackendStatusNotificationProps> = ({
  isVisible,
  onDismiss,
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const apiBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://metagym.metacodecx.com';
        const response = await fetch(`${apiBase}/api/v1/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  // Handlers for hover with delay to avoid flicker
  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsHovered(false), 150);
  };

  return (
    <div
      className="fixed top-4 right-4 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="relative flex flex-col items-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Icon Button */}
        <button
          className={`
            flex items-center justify-center rounded-full shadow-md border
            transition-colors duration-200
            ${isOnline
              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
              : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
            }
            w-10 h-10
            focus:outline-none
          `}
          aria-label={isOnline ? 'الخادم متصل' : 'الخادم غير متصل'}
          tabIndex={0}
          type="button"
        >
          {isOnline ? (
            <Wifi className="h-5 w-5" />
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
        </button>
        {/* Notification Panel */}
        <div
          className={`
            absolute top-0 right-12 min-w-[220px] max-w-xs
            transition-all duration-200
            ${isHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
            ${isOnline
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-orange-50 border border-orange-200 text-orange-800'
            }
            rounded-md shadow-lg px-4 py-2
            flex items-start gap-2
          `}
          style={{
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
            direction: 'rtl',
          }}
        >
          <span className="mt-0.5">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
            )}
          </span>
          <div className="flex-1">
            <div className="font-semibold text-xs mb-0.5">
              {isOnline ? 'الخادم متصل' : 'الخادم غير متصل'}
            </div>
            <div className="text-[11px] opacity-80">
              {isOnline
                ? 'تم الاتصال بالخادم الخلفي'
                : 'لا يمكن الاتصال بالخادم الخلفي. سيتم استخدام البيانات الوهمية.'
              }
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
            tabIndex={0}
            aria-label="إغلاق التنبيه"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};