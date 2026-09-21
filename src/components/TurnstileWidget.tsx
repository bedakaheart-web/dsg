import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, any>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY =
  (import.meta as any)?.env?.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAEyz-wD6yQmn6txp";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpired?: () => void;
  onError?: (msg: string) => void;
  onReady?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders Cloudflare Turnstile once per mount and loads the script only when this
 * component is mounted. Ensures a single widget instance per mount + proper cleanup.
 */
export default function TurnstileWidget({
  onToken,
  onExpired,
  onError,
  onReady,
  theme = "dark",
  className,
  style,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onExpiredRef = useRef(onExpired);
  const onErrorRef = useRef(onError);
  const onReadyRef = useRef(onReady);
  onTokenRef.current = onToken;
  onExpiredRef.current = onExpired;
  onErrorRef.current = onError;
  onReadyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const renderWidget = () => {
      if (cancelled) return false;
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        return !!widgetIdRef.current;
      }
      if (containerRef.current.childElementCount > 0) {
        containerRef.current.innerHTML = "";
      }
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          callback: (token: string) => {
            if (cancelled) return;
            onTokenRef.current(token);
          },
          "expired-callback": () => {
            if (cancelled) return;
            onExpiredRef.current?.();
            try {
              if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
            } catch {}
          },
          "timeout-callback": () => {
            if (cancelled) return;
            onErrorRef.current?.("Security check timed out. Please retry.");
          },
          "error-callback": () => {
            if (cancelled) return;
            onErrorRef.current?.("Security check failed to load. Check your connection / ad-blocker and retry.");
          },
        });
        if (!cancelled) onReadyRef.current?.();
        return true;
      } catch (e) {
        console.error("[TurnstileWidget] render failed:", e);
        onErrorRef.current?.("Security check failed to load. Check your connection / ad-blocker and retry.");
        return false;
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let attempts = 0;
      pollTimer = setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          if (pollTimer) clearInterval(pollTimer);
          renderWidget();
        } else if (attempts > 50) {
          if (pollTimer) clearInterval(pollTimer);
          if (!cancelled) onErrorRef.current?.("Security check failed to load. Check your connection / ad-blocker and retry.");
        }
      }, 200);

      const existing = document.querySelector<HTMLScriptElement>('script[src*="turnstile"]');
      const onLoad = () => renderWidget();
      existing?.addEventListener("load", onLoad);
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.addEventListener("load", onLoad);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      try {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
      } catch {}
      widgetIdRef.current = null;
    };
  }, [theme]);

  return <div ref={containerRef} className={className} style={style} />;
}

export { TURNSTILE_SITE_KEY };
