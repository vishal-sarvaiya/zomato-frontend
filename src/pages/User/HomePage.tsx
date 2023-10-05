import React, { RefObject, useEffect, useRef, useState } from 'react'
import "../../assets/css/homepage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleRight, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { BASE_URL, apiList } from '../../utils/api'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../utils/user.context'
import { toast } from 'react-toastify'
import Questions from '../../components/User/Questions'

interface City {
    city_name: string,
    _id: string
}

interface CityWithCount {
    city: string,
    numberOfRestaurants: number
}

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


const HomePage = () => {
    const [city, setCity] = useState<City[]>([]);
    const [cityWithCount, setCityWithCount] = useState<CityWithCount[]>([]);
    const [foodData, setFoodData] = useState<Food[]>([])
    const [restaurantData, setRestaurantData] = useState<Restaurant[]>([])
    const [searchResult, setSearchResult] = useState<Food[]>([])
    const [restaurantSearchResult, setRestaurantSearchResult] = useState<Restaurant[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const navigate = useNavigate();
    const ref: RefObject<HTMLDivElement> = useRef(null)



    const { token,role, isLoggedIn, setIsLoggedIn, userName, firstTimeLogin } = useUser()
    const fetchCity = async () => {
        const cityRes = await axios.get(BASE_URL + apiList.getcity)
        setCity(cityRes.data.data.CityData)
        setCityWithCount(cityRes.data.data.CityRestaurantCount);
    }
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

    const handleLogout = () => {
      localStorage.clear();
        setIsLoggedIn("")
        navigate("/")
    };

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
            if (err?.response?.status === 401) {
                setIsLoggedIn("")
                toast.error(err?.response?.data?.error, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
            }
        }
    }


    useEffect(() => {
        fetchCity();
        getData()
    }, [])

    const handleSearch = (value: string) => {
        if (value.trim() !== "") {
            const foodFound = foodData.filter((food) => {
                // return food.name == value
                return food.name.toLowerCase().includes(value.trim())
            })

            const restaurantFound = restaurantData.filter((restaurant) => {
                // return food.name == value
                return restaurant.restaurant_name.toLowerCase().includes(value.trim())
            })
            // const combinedResults = [...foodFound, ...restaurantFound];
            setSearchResult(foodFound)
            setRestaurantSearchResult(restaurantFound)
        }
        else {
            setSearchResult([])
            setRestaurantSearchResult([])
        }
    }
    return (
        <div>
           {firstTimeLogin === "true" && <Questions/>}
            <div className='back px-2 position-relative'>
                <div className='d-flex justify-content-end align-items-center col-12 position-absolute top-0 mt-3 container'>
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
                        <div className='d-flex text-white align-items-center justify-content-between fs-6 cursor-pointer' style={{width: "110px"}}
                        onClick={() => { setVisible(true) }}>
                            <img className="dropbtn" 
                                src={require("./../../assets/Images/profile-avatar.jpeg")}
                                height='38' width='38' alt=''/>
                            <div>{userName}</div>
                            <div>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        <div
                            id="myDropdown"
                            className={`dropdown-content  ${visible === true ? 'show' : ''}`}
                            ref={ref}>
                            <Link to={`/orders?user=${isLoggedIn}`} className='link-div profile-options'>
                                <div>My Orders</div>
                            </Link>
                            <div className="dashed-border my-1"></div>
                            <div className='profile-options logout' onClick={handleLogout}>
                                <div >Logout</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <img src={require("../../assets/Images/zomato-name.avif")} height='60' width='300' alt='' />
                </div>
                <div className='discover-food'>Discover the best food & drinks in Ahmedabad</div>
                <div className="my-2 my-lg-0 d-flex search-container justify-content-center">
                    {/* <form className="form-inline my-2 my-lg-0 d-flex"> */}
                    <div className='d-flex flex-column'>
                        <input className="form-control search-box" type="search"
                            onChange={(e) => {
                                handleSearch(e.target.value)
                            }}
                            placeholder="Search for restaurant, cuisine or a dish" aria-label="Search" />

                        {
                            searchResult && searchResult.length > 0 &&
                            // <div className='search-div'  >
                            <div className={searchResult.length >0 && restaurantSearchResult.length ===0 ? 'search-div search-div-active' : 'search-div search-div-inactive'}  >
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
                                                            className='rounded'
                                                            height='80' width='80' alt=''/>
                                                    </div>
                                                    <div className='d-flex flex-column ms-3'>
                                                        <div className=' h5' >{searchResult.name}</div>
                                                        <div className='opacity-80'>Dish</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                            </div>
                        }
                        {
                            restaurantSearchResult && restaurantSearchResult.length > 0 &&
                            <div className={searchResult.length ===0 && restaurantSearchResult.length > 0 ? 'search-div search-div-active' : 'search-div search-div-inactive'}  >
                                {
                                    restaurantSearchResult.map((searchResult) => {
                                        return (
                                            // <Link to={`foodproduct?restaurant=${searchResult.restaurant_id}&fooditem=${searchResult._id}`} replace >
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
                                                            height='80' width='80' alt='' />
                                                    </div>
                                                    <div className='d-flex flex-column ms-3'>
                                                        <div className=' h5' >{searchResult.restaurant_name}</div>
                                                        <div className='opacity-80'>Restaurant</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                            </div>
                        }
                    </div>

                    {/* <div>
                        <button className="btn btn-light my-2 my-sm-0 ms-2 search-button" type="submit">Search</button>
                    </div> */}
                    {/* </form> */}
                </div>


            </div>

            <div className='px-5 m-5'>
                <div className='popular-heading'>
                    Popular localities in and around <span className='current-city'>Gujarat</span>
                </div>
                <div className="row d-flex justify-content-start mt-3">

                    {
                        city.map((city, index) => {
                            const cityCountItem = cityWithCount.find(
                                (cityWithCount) => cityWithCount.city === city.city_name
                            );

                            // If a matching item is found, use the count from CityRestaurantCount; otherwise, use 0
                            // const count =
                            //     cityCountItem && cityCountItem.hasOwnProperty('numberOfRestaurants')
                            //         ? cityCountItem.numberOfRestaurants
                            //         : 0;

                            const count = cityCountItem ? cityCountItem.numberOfRestaurants : 0;

                            return (
                                <Link className='link-div city-navigator mt-3' to={`/dashboard/?city=${city.city_name}`} key={index}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='d-flex flex-column'>
                                            <div className='weight-400-20'>{city.city_name}</div>
                                            <div className='opacity-80'>{count} Places</div>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                    <Link className='link-div city-navigator mt-3 d-flex justify-content-between align-items-center' to={`/dashboard`}>
                        <div className='weight-400-20'>All Restaurants</div>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                </div>

            </div>
        </div >
    )
}

export default HomePage