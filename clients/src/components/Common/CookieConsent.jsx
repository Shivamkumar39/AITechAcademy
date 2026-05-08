import React, { useEffect, useState } from "react";

const KEY = "AITECH_COOKIE_OK";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 9999, background: "#0f2e2c", color: "#fff", padding: "12px 14px", borderRadius: 10 }}>
      <p style={{ margin: 0, fontSize: 14 }}>
        We use cookies to improve experience and analytics for AITECHACADEMY.
      </p>
      <button
        style={{ marginTop: 8, background: "#0f8f87", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setShow(false);
        }}
      >
        Accept
      </button>
    </div>
  );
}
