import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export const useSocket = (userId, onTaskCreated, onTaskUpdated, onTaskDeleted) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Connect to Socket.IO server
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time server');
      socket.emit('join', userId);
    });

    socket.on('task_created', (task) => {
      console.log('📝 New task created:', task);
      if (onTaskCreated) onTaskCreated(task);
    });

    socket.on('task_updated', (task) => {
      console.log('✏️ Task updated:', task);
      if (onTaskUpdated) onTaskUpdated(task);
    });

    socket.on('task_deleted', ({ id }) => {
      console.log('🗑️ Task deleted:', id);
      if (onTaskDeleted) onTaskDeleted(id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId, onTaskCreated, onTaskUpdated, onTaskDeleted]);

  return socketRef.current;
};
