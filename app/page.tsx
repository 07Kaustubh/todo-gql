'use client'

import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apolloClient';
import { TodoList } from '../components/TodoList';

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main className="container mx-auto px-4">
        <TodoList />
      </main>
    </ApolloProvider>
  );
}

