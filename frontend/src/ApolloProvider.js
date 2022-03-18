import React from 'react';
import App from './App';
import { 
    ApolloClient,
    InMemoryCache,
    createHttpLink, 
    ApolloProvider,
} from '@apollo/client';
import { CookiesProvider } from "react-cookie";

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/',
    credentials: 'include',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default (
    <React.StrictMode>
        <ApolloProvider client={client}>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </ApolloProvider>
    </React.StrictMode>
);