// src/context/MessageContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
    const [message, setMessage] = useState(null); // { text: '...', type: 'success' | 'error' }
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const showMessage = useCallback((text, type = 'info', duration = 5000) => {
        // Clear any existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setMessage({ text, type });
        setIsVisible(true);

        const newTimeoutId = setTimeout(() => {
            setIsVisible(false);
            setMessage(null); // Clear message data after fading out
        }, duration);
        setTimeoutId(newTimeoutId);
    }, [timeoutId]);

    const hideMessage = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
        setMessage(null);
    }, [timeoutId]);

    const contextValue = useMemo(() => ({
        message,
        isVisible,
        showMessage,
        hideMessage,
    }), [message, isVisible, showMessage, hideMessage]);

    return (
        <MessageContext.Provider value={contextValue}>
            {children}
            {/* Render the MessageDisplay component here so it always has access to the context */}
            <MessageDisplay />
        </MessageContext.Provider>
    );
}

// Custom hook to use the message context
export function useMessage() {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
}

// Internal component to display the message
function MessageDisplay() {
    const { message, isVisible, hideMessage } = useMessage();

    if (!message || !isVisible) {
        return null;
    }

    const messageStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div
            className={`fixed bottom-4 right-4 z-[100] p-4 pr-10 rounded-lg shadow-xl text-white
                        transform transition-all duration-500 ease-out
                        ${messageStyles[message.type] || messageStyles.info}
                        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ minWidth: '250px' }}
        >
            <p className="font-semibold text-lg">{message.text}</p>
            <button
                onClick={hideMessage}
                className="absolute top-2 right-2 text-white text-xl font-bold p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
                &times;
            </button>
        </div>
    );
}