import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  getScrollRestorationKey: (location) => location.pathname,
  scrollRestorationBehavior: 'instant',
  context: { queryClient },
  defaultViewTransition: true,
  defaultNotFoundComponent: () => <h1>Not Found :(</h1>
});



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  )
}

export default App
