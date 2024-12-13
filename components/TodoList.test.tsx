import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { TodoList } from './TodoList';
import { GET_TODOS, CREATE_TODO, UPDATE_TODO, DELETE_TODO } from '../graphql/todo.graphql';

const mocks = [
  {
    request: {
      query: GET_TODOS,
    },
    result: {
      data: {
        todos: [
          { id: '1', title: 'Todo 1', completed: false },
          { id: '2', title: 'Todo 2', completed: true },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_TODO,
      variables: { title: 'New Todo' },
    },
    result: {
      data: {
        createTodo: {
          id: '3',
          title: 'New Todo',
          completed: false,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_TODO,
      variables: { id: '1', completed: true },
    },
    result: {
      data: {
        updateTodo: {
          id: '1',
          title: 'Todo 1',
          completed: true,
        },
      },
    },
  },
  {
    request: {
      query: DELETE_TODO,
      variables: { id: '1' },
    },
    result: {
      data: {
        deleteTodo: true,
      },
    },
  },
];

describe('TodoList', () => {
  it('renders todos and allows creating a new todo', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TodoList />
      </MockedProvider>
    );

    expect(await screen.findByText('Todo 1')).toBeInTheDocument();
    expect(await screen.findByText('Todo 2')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), {
      target: { value: 'New Todo' },
    });
    fireEvent.click(screen.getByText('Add Todo'));

    expect(await screen.findByText('New Todo')).toBeInTheDocument();
  });

  it('allows updating a todo', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TodoList />
      </MockedProvider>
    );

    const checkbox = await screen.findByRole('checkbox', { name: /Todo 1/i });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('allows deleting a todo', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TodoList />
      </MockedProvider>
    );

    const deleteButton = await screen.findByRole('button', { name: /Delete todo/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    });
  });
}); 