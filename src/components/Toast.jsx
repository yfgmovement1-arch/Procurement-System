import React, { useEffect } from 'react';

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#185FA5',
      color: '#fff',
      padding: '12px 18px',
      borderRadius: '8px',
      fontSize: '13px',
      zIndex: 200,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      ✓ {message}
    </div>
  );
}
