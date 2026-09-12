import { useEffect, useState } from "react";

interface DeferredPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPrompt | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = e as DeferredPrompt;
      setDeferredPrompt(prompt);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowInstall(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setShowInstall(false);
    setDeferredPrompt(null);
  };

  const dismissInstall = () => {
    setShowInstall(false);
    setDeferredPrompt(null);
  };

  if (!showInstall || isInstalled) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: "#0d1b2e",
      borderTop: "1px solid rgba(0,200,224,0.15)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ color: "#eef0f7", fontSize: 14, lineHeight: 1.5 }}>
        <strong style={{ fontSize: 15 }}>Install DumaSafeGuide</strong>
        <br />
        <span style={{ color: "rgba(238,240,247,0.6)" }}>
          Add to your home screen for quick access and offline use.
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={dismissInstall}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(238,240,247,0.6)",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          Dismiss
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: "#2ECC8F",
            border: "none",
            color: "#080c14",
            borderRadius: 8,
            padding: "8px 20px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
