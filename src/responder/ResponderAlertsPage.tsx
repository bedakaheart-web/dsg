export default function ResponderAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Initial fetch
    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from("alerts")
          .select("id, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        if (err) throw err;
        setAlerts(data ?? []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load alerts:", err);
        setError("Error loading alerts");
        setLoading(false);
      }
    };

    void load();

    // Real-time subscriptions
    const channel = supabase
      .channel("resp-alerts-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const newAlert = payload.new as { id: string; created_at: string };
        setAlerts(prev => {
          if (prev.some(a => a.id === newAlert.id)) return prev;
          return [...prev, newAlert];
        });
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>Loading alerts…</div>;
  if (error) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>Error: {error}</div>;
  if (alerts.length === 0) return <div style={{ padding: 20, color: "rgba(238,240,247,0.4)" }}>No alerts.</div>;

  return (
    <div style={{ padding: 16, color: "#eef0f7" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Alerts</h3>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {alerts.map((alert, i) => (
          <div
            key={alert.id}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>Alert</span>
            <span style={{ fontSize: 10, color: "rgba(238,240,247,0.4)" }}>
              {new Date(alert.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}