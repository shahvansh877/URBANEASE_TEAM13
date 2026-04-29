import { API_BASE_URL as API } from "../config/api";

export function subscribeRealtime(token, onEvent) {
  if (!token || typeof EventSource === "undefined") return () => {};

  const url = `${API}/realtime?token=${encodeURIComponent(token)}`;
  const source = new EventSource(url);

  source.onmessage = (message) => {
    try {
      onEvent(JSON.parse(message.data));
    } catch {
      // Ignore malformed keepalive or partial messages.
    }
  };

  source.onerror = () => {
    // EventSource automatically retries; keeping this quiet avoids UI noise.
  };

  return () => source.close();
}

export function isBookingEvent(event) {
  return typeof event?.type === "string" && event.type.startsWith("booking:");
}

export function isAdminRealtimeEvent(event) {
  return (
    isBookingEvent(event) ||
    event?.type?.startsWith("provider:") ||
    event?.type?.startsWith("user:")
  );
}
