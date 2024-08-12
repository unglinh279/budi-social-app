import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://hqcqgadcybcnjb46ir2qu3yleu.appsync-api.ap-southeast-2.amazonaws.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-api-key': 'da2-su6mlqj5s5el7ae3ekx7sodu64',
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
