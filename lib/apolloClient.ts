import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'same-origin'
});

export const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          todos: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

