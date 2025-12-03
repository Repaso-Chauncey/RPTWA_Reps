import React from 'react';

/**
 * DevIndicator Component
 * Displays a visible "DEV" badge when running in development mode
 * to help developers identify which environment they're working in.
 */
const DevIndicator = () => {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Don't render anything in production
  if (!isDevelopment) {
    return null;
  }

  const styles = {
    container: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#ff6b35',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      cursor: 'default',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#4ade80',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div style={styles.container} title="Development Environment">
        <span style={styles.dot}></span>
        DEV
      </div>
    </>
  );
};

export default DevIndicator;
