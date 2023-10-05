import React, { ReactNode, createContext, useContext, useState } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, redirect, useLoaderData, useNavigate } from 'react-router-dom'


const UserContext = createContext<
  {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>

  }
>({
  isLoggedIn: false, setIsLoggedIn: () => null
})


const A = () => {
  const navigate = useNavigate()
  const { setIsLoggedIn } = useContext(UserContext);
  return <div>
    <button type="button" className="btn btn-outline-primary" onClick={() => {
      localStorage.setItem('token', 'token')
      setIsLoggedIn(true)
      navigate('/dashboard')
    }}>Login Now</button>
  </div>
}


const Dashboard = () => {

  const navigate = useNavigate();
  const data = useLoaderData();
  const { setIsLoggedIn } = useContext(UserContext);

  return <div>
    <button
      onClick={() => {
        localStorage.clear();
        setIsLoggedIn(false)
        navigate('/login')
      }}
    >Logout</button>
  </div>
}


const C = () => {
  return <div>Page C</div>
}


const D = () => {
  return <div>Page D</div>
}


const Protected = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useContext(UserContext);
  if (!isLoggedIn) return <Navigate to="/login" />
  return <>{children}</>
}


const wait = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem('token')
      resolve(token)
    }, duration)
  })
}



const createRoutes = (isLoggedIn: boolean) => {

  return createBrowserRouter([
    {
      //Protected Routes
      path: '',

      // loader: async () => {
      //   const token = await wait(2000);
      //   if (!token) return redirect('/login')
      //   return { token, message: "I am here!!!" };
      // },
      // errorElement: <ErrorBoundary />,
      element: <Outlet />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'dashboard/something',
          element: <D />
        },
      ]
    },
    {
      path: '',
      loader: () => {
        if (isLoggedIn) return redirect('/dashboard')
        return null;
      },
      element: <Outlet />,
      children: [
        {
          path: 'login',
          element: <A />,

        },
        {
          path: 'register',
          element: <C />
        }
      ]
    }
  ])
}



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <RouterProvider router={createRoutes(!!isLoggedIn)} />
    </UserContext.Provider>
  )
}

export default App