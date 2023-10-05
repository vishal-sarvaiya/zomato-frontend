import { useEffect, useState } from 'react';
import { Route, Routes} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ViewOrder from './components/User/ViewOrder';
import ProtectedRoute from './pages/ProtectedRoute';
import FoodItemForm from './pages/Restaurant/FoodItemForm';
import RestaurantDashboard from './pages/Restaurant/RestaurantDashboard';
import RestaurantLogin from './pages/Restaurant/RestaurantLogin';
import RestaurantRegistration from './pages/Restaurant/RestaurantRegistration';
import Cart from './pages/User/Cart';
import Dashboard from './pages/User/Dashboard';
import FoodProduct from './pages/User/FoodProduct';
import Login from './pages/User/Login';
import Orders from './pages/User/Orders';
import ProductPage from './pages/User/ProductPage';
import Registration from './pages/User/Registration';
import { UserProvider } from './utils/user.context';
import HomePage from './pages/User/HomePage';
import Footer from './components/Footer';
import Unauthorised from './pages/Unauthorised';
import jwtDecode from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Questions from './components/User/Questions';


function App() {
  const userId = localStorage.getItem("userId")
  const fetchedToken = localStorage?.getItem("token")
  const firstTimeLogin = localStorage?.getItem("firstTimeLogin") || "true"

  const [isLoggedIn, setIsLoggedIn] = useState<string>(userId ? userId : "")
  const [token, setToken] = useState<string>(fetchedToken ? fetchedToken : "")
  const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGU0NDA1ZTllN2E4MmMwZGYwOWI0NjQiLCJyb2xlIjoidW5kZWZpbmVkIiwibmFtZSI6IlZpc2hhbCIsImlhdCI6MTY5NTM2MTU1NSwiZXhwIjoxNjk1MzY1MTU1fQ.CckFxo7goRGchxR2_k7LGNOCedEr2q6IPKC42YooJKo"
  const [role, setRole] = useState<string>(() => {
    const decodedToken: any = jwtDecode(fetchedToken ? fetchedToken : dummyToken)
    return decodedToken?.role ? decodedToken?.role : "undefined"
  })
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // getRole();
    if (fetchedToken) {
      const decodedToken: any = jwtDecode(fetchedToken ? fetchedToken : token)
      setUserName(decodedToken?.name)
      setRole(decodedToken?.role);
    }
  }, [token, fetchedToken])

  return (
    <>
      <UserProvider isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
        token={token} setToken={setToken}
        role={role} setRole={setRole}
        userName={userName} setUserName={setUserName}
        firstTimeLogin={firstTimeLogin}
      >
        <Navbar />
        {/********************************** Public Routes **************************/}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/restaurant/registration' element={<RestaurantRegistration />} />
          <Route path='restaurant/login' element={<RestaurantLogin />} />
          <Route path="/unauthorised" element={<Unauthorised />} />

          {/********************************** Protected Routes **************************/}
          {/********************************** User Routes **************************/}

          {role &&
            <>
              <Route path='/questions' element={<ProtectedRoute Component={Questions} allowedRoles={["user"]} />} />
              <Route path='/homepage' element={<ProtectedRoute Component={HomePage} allowedRoles={['user']} />} />
              <Route path='/dashboard'>
                <Route index={true} element={<ProtectedRoute Component={Dashboard} allowedRoles={['user']} />} />
                <Route index={false} path='productpage' element={<ProtectedRoute Component={ProductPage} allowedRoles={['user']} />} />
              </Route>
              <Route path='/foodproduct' element={<ProtectedRoute Component={FoodProduct} allowedRoles={['user']} />} />
              <Route path='/cart' element={<ProtectedRoute Component={Cart} allowedRoles={['user']} />} />
              <Route path='/orders' element={<ProtectedRoute Component={Orders} allowedRoles={['user']} />} />
              <Route path='/vieworder' element={<ProtectedRoute Component={ViewOrder} allowedRoles={['user']} />} />

              {/********************************** Restaurant Routes **************************/}
              <Route path='/restaurant'>
                <Route index path='dashboard' element={<ProtectedRoute Component={RestaurantDashboard} allowedRoles={['restaurant']} />} />
                <Route path='fooditemform' element={<ProtectedRoute Component={FoodItemForm} allowedRoles={['restaurant']} />} />
              </Route>
            </>
          }

        </Routes>
        <Footer />
      </UserProvider >
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}

export default App;
