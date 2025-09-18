import './App.css'
import {createBrowserRouter, Outlet, RouterProvider} from "react-router"

function App() {
  return <RouterProvider router={router} />
}

function Home() {
  return (
    <>
      <div>Home</div>
      <Outlet />
    </>
  )
}

function PageOne() {
  return <div>Page One</div>
}

function PageTwo() {
  return <div>Page Two</div>
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
    children: [
      {
        path: 'pageone',
        Component: PageOne,
      },
      {
        path: 'pagetwo',
        Component: PageTwo,
      },
    ],
  },
])

export default App
