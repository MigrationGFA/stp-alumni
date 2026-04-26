// lib/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useWebSocket({ onNewMessage, onTyping, onReadReceipt, onPresence } = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const { data: session } = useSession();
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!session?.accessToken) return;

    const ws = new WebSocket("wss://app.gfa-tech.com/ws");
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate immediately
      ws.send(JSON.stringify({ type: "auth", token: session.accessToken }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "authenticated":
            setIsConnected(true);
            console.log("Authenticated:", data.message);
            break;
            
          case "new_message":
            onNewMessage?.(data);
            break;
            
          case "typing":
            onTyping?.(data);
            break;
            
          case "read_receipt":
            onReadReceipt?.(data);
            break;
            
          case "presence":
            onPresence?.(data);
            break;
            
          case "connected":
            console.log("Connected, waiting for auth");
            break;
            
          default:
            console.log("Unknown message type:", data);
        }
      } catch (error) {
        console.error("WebSocket parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      
      // Reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    socketRef.current = ws;
  }, [session?.accessToken, onNewMessage, onTyping, onReadReceipt, onPresence]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((conversationId, content) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "message",
        conversationId,
        content
      }));
    }
  }, []);

  const sendTyping = useCallback((conversationId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "typing",
        conversationId
      }));
    }
  }, []);

  const sendReadReceipt = useCallback((conversationId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "read",
        conversationId
      }));
    }
  }, []);

  return {
    isConnected,
    sendMessage,
    sendTyping,
    sendReadReceipt
  };
}