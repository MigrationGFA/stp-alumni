// lib/hooks/useWebSocket.js
"use client";

import useAuthStore from "@/lib/store/useAuthStore";
import { useEffect, useRef, useCallback, useState } from "react";

export function useWebSocket({ onNewMessage, onTyping, onReadReceipt, onPresence } = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const { token } = useAuthStore();

     const onNewMessageRef = useRef(onNewMessage);
    const onTypingRef = useRef(onTyping);
    const onReadReceiptRef = useRef(onReadReceipt);
    const onPresenceRef = useRef(onPresence);

    // Keep refs in sync on every render
    useEffect(() => {
        onNewMessageRef.current = onNewMessage;
        onTypingRef.current = onTyping;
        onReadReceiptRef.current = onReadReceipt;
        onPresenceRef.current = onPresence;
    });


    const connect = useCallback(() => {
        if (!token) {
            console.log("No token available, skipping WebSocket connection");
            return;
        }

        try {
            const ws = new WebSocket("wss://app.gfa-tech.com/ws");

            ws.onopen = () => {
                console.log("WebSocket connected");
                // Authenticate immediately after connection
                ws.send(JSON.stringify({ type: "auth", token }));
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
                            onNewMessageRef.current?.(data); // always latest
                            break;
                        case "typing":
                            onTypingRef.current?.(data);
                            break;
                        case "read_receipt":
                            onReadReceiptRef.current?.(data);
                            break;
                        case "presence":
                            onPresenceRef.current?.(data);
                            break;
                        case "connected":
                            console.log("Connected to WebSocket, waiting for auth");
                            break;
                        case "message_sent":
                            console.log("Message sent confirmation:", data);
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

          ws.onclose = (event) => {
                console.log("WebSocket disconnected:", event.code, event.reason);
                setIsConnected(false);
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = setTimeout(connect, 5000);
            };
            socketRef.current = ws;
        } catch (error) {
            console.error("Failed to create WebSocket:", error);
        }
    }, [token, onNewMessage, onTyping, onReadReceipt, onPresence]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [connect]);

    const sendMessage = useCallback((conversationId, content) => {
        if (!conversationId || !content) {
            console.error("Missing conversationId or content");
            return false;
        }

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "message",
                conversationId,
                content
            }));
            return true;
        }
        console.warn("WebSocket not open, message not sent");
        return false;
    }, []);

    const sendTyping = useCallback((conversationId) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "typing",
                conversationId
            }));
            return true;
        }
        return false;
    }, []);

    const sendReadReceipt = useCallback((conversationId) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "read",
                conversationId
            }));
            return true;
        }
        return false;
    }, []);

    return {
        isConnected,
        sendMessage,
        sendTyping,
        sendReadReceipt
    };
}