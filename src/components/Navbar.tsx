import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { UserContext } from "../pages/ProtectedRoute"
import { faCartShopping, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import "../assets/css/navbar.css";
import { useUser } from '../utils/user.context';
import axios from 'axios';
import { BASE_URL, apiList } from '../utils/api';
import { toast } from 'react-toastify';

interface Food {
    _id: string,
    restaurant_id: string,
    name: string,
    image: string,
}
interface Restaurant {
    _id: string,
    restaurant_name: string,
    restaurant_images: string[]
}

const Navbar: React.FC = () => {
    const [foodData, setFoodData] = useState<Food[]>([])
    const [restaurantData, setRestaurantData] = useState<Restaurant[]>([])
    const [searchResult, setSearchResult] = useState<Food[]>([])
    const [restaurantSearchResult, setRestaurantSearchResult] = useState<Restaurant[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const ref: RefObject<HTMLDivElement> = useRef(null)
    const [visible, setVisible] = useState<boolean>(false)
    const { isLoggedIn, setIsLoggedIn, role, token } = useUser()
    const [searchResultVisible, setSearchResultVisible] = useState<boolean>(false)
    const [searchStarted, setSearchStarted] = useState<boolean>(false)


    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn("")
        navigate("/")
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/restaurant/login" && location.pathname !== "/restaurant/registration") {
            getData();
        }
    }, [searchStarted])
    // }, [searchStarted, location.pathname])

    const closeDropdown = () => {
        if (visible) {
            setVisible(false);
        }
    };

    useEffect(() => {
        // Close the dropdown when the pathname changes
        closeDropdown();
        setSearchResultVisible(false)
    }, [location.pathname, location.search, location.key]);

    console.log("locxation in navbar", location.pathname)
  
    const getData = async () => {
        try {
            const foodRes = await axios.get(BASE_URL + apiList.getallfood, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            )
            const restaurantRes = await axios.get(BASE_URL + apiList.getrestaurant, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setFoodData(foodRes.data.data)
            setRestaurantData(restaurantRes.data)
        }
        catch (err) {
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                toast.error(err?.response?.data?.error, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                setIsLoggedIn("")
            }
        }
    }

    const handleSearch = (value: string) => {
        setSearchStarted(true)
        setSearchResultVisible(true)
        if (value.trim() !== "") {
            const foodFound = foodData.filter((food) => {
                return food.name.toLowerCase().includes(value.trim())
            })

            const restaurantFound = restaurantData.filter((restaurant) => {
                return restaurant.restaurant_name.toLowerCase().includes(value.trim())
            })
            setSearchResult(foodFound)
            setRestaurantSearchResult(restaurantFound)
        }
        else {
            setSearchResult([])
            setRestaurantSearchResult([])
        }
    }

    if (location.pathname === "/homepage") {
        return null
    }
    return (
        <div className=''>  
                <nav className={role !== "restaurant"
                ?
                "navbar navbar-expand-lg px-2 navbar-light bg-light d-flex justify-content-evenly"
                :
                "navbar navbar-expand-lg px-2 navbar-light bg-light d-flex justify-content-between px-4"}>
                <div className="navbar-brand col-3" onClick={() => { role !== "restaurant" ? navigate("/homepage") : navigate("/restaurant/dashboard") }}>Zomato</div>
                
                {/* <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    City
                </div> */}
                {role === "user" ?
                    <div className="col-4 search-input-div">
                        <form className="form-inline my-2 my-lg-0 d-flex">
                            <input className="search-input mr-sm-2 w-100" type="search"
                                onChange={(e) => {
                                    handleSearch(e.target.value)
                                }}
                                placeholder="Search for restaurant, cuisine or a dish" aria-label="Search" />
                            {/* <div className='search-btn-div zomato-color'>
                            <button className="btn my-2 my-sm-0" type="submit">
                                <FontAwesomeIcon icon={faSearch} className='fa-lg' />
                            </button>
                        </div> */}
                        </form>

                        {
                            searchResultVisible === true &&
                            searchResult && searchResult.length > 0 &&
                            // <div className='search-result-div col-4' >
                            <div className={searchResult.length > 0 && restaurantSearchResult.length === 0 ? 'search-result-div search-div-active col-4' : 'search-result-div search-div-inactive'}  >
                                {
                                    searchResult.map((searchResult) => {
                                        return (
                                            // <Link to={`foodproduct?restaurant=${searchResult.restaurant_id}&fooditem=${searchResult._id}`} replace >
                                            <Link
                                                className='link-div'
                                                to={{
                                                    pathname: '/foodproduct', // Set the pathname to '/foodproduct'
                                                    search: `?restaurant=${searchResult.restaurant_id}&fooditem=${searchResult._id}`,
                                                }}
                                            // replace // Add the 'replace' prop here
                                            >
                                                <div className='d-flex mx-2 search-item'>
                                                    <div>
                                                        <img src={BASE_URL + searchResult.image}
                                                            className='rounded' alt=''
                                                            height='60' width='60' />
                                                    </div>
                                                    <div className='d-flex flex-column ms-3 '>
                                                        <div className='h6' >{searchResult.name}</div>
                                                        <div className='opacity-80 fs-6'>Dish</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                            </div>
                        }
                        {
                            searchResultVisible === true &&
                            restaurantSearchResult && restaurantSearchResult.length > 0 &&
                            <div className={searchResult.length === 0 && restaurantSearchResult.length > 0 ? 'search-result-div search-div-active col-4' : 'search-result-div search-div-inactive'}  >
                                {/* <div className='search-result-div col-4'> */}
                                {
                                    restaurantSearchResult.map((searchResult) => {
                                        return (
                                            <Link
                                                className='link-div'
                                                to={{
                                                    pathname: '/dashboard', // Set the pathname to '/foodproduct'
                                                    search: `?restaurant=${searchResult._id}`,
                                                }}
                                            // replace // Add the 'replace' prop here
                                            >
                                                <div className='d-flex mx-2 search-item'>
                                                    <div>
                                                        <img src={BASE_URL + searchResult.restaurant_images[0]}
                                                            className='rounded'
                                                            height='60' width='60' alt='' />
                                                    </div>
                                                    <div className='d-flex flex-column ms-3'>
                                                        <div className='h6' >{searchResult.restaurant_name}</div>
                                                        <div className='opacity-80 fs-6'>Restaurant</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                            </div>
                        }

                    </div>
                    :
                    <div style={{width:"444px"}}></div>}
                <div className='d-flex justify-content-end col-3'>

                    {
                        isLoggedIn !== "" ?
                            (
                                <div className='d-flex justify-content-end align-items-center col-4'>
                                    {
                                        role === "user" &&
                                        <div className='me-3'>
                                            <Link to={`/cart?user=${isLoggedIn}`}>
                                                <FontAwesomeIcon icon={faCartShopping} className='zomato-color'
                                                    style={{ height: "30px", width: "30px" }} />
                                            </Link>
                                        </div>

                                    }
                                    <div className="dropdown">
                                        <img className="dropbtn" onClick={() => { setVisible(true) }}
                                            src={require("../assets/Images/profile-avatar.jpeg")}
                                            height='50' width='50' alt='' />
                                        <div
                                            id="myDropdown"
                                            className={`dropdown-content  ${visible === true ? 'show' : ''}`}
                                            ref={ref}>
                                            {role !== "restaurant" &&
                                                <Link to={`/orders?user=${isLoggedIn}`} className='link-div profile-options'>
                                                    <div>My Orders</div>
                                                </Link>}
                                            {role !== "restaurant" &&
                                                <div className="dashed-border my-1"></div>}
                                            <div className='profile-options logout' onClick={handleLogout}>
                                                <div >Logout</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            <div>
                                {
                                   location.pathname === "/register" &&
                                    // location.pathname !== "/" && role !== "restaurant" &&
                                    <button className='btn btn-primary' onClick={() => navigate("/")}>Login</button>
                                }
                                {
                                    location.pathname === "/" &&
                                    <button className='btn btn-success' onClick={() => navigate("/register")}>Register</button>
                                }
                                {
                                    location.pathname === "/restaurant/registration" &&
                                    // location.pathname !== "/restaurant/login" && role === "restaurant" &&
                                    <button className='btn btn-primary' onClick={() => navigate("/restaurant/login")}>Login</button>
                                }
                                {
                                    location.pathname === "/restaurant/login" &&
                                    <button className='btn btn-success' onClick={() => navigate("/restaurant/registration")}>Register</button>
                                }
                            </div>

                    }
                </div>

            </nav>
            <hr className='m-0' />
        </div>
    )

}
export default Navbar

