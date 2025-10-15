import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';

delete window.location;
window.location = new URL('http://localhost/');

test('renders App without crashing', () => {
    render(
        <AuthProvider>
            <MessageProvider>
                <App /> {/* App already includes BrowserRouter */}
            </MessageProvider>
        </AuthProvider>
    );
});
