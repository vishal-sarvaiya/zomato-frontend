import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL, apiList } from '../../utils/api';
import "../../assets/css/productpage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCircleCheck, faCircleInfo, faDiamondTurnRight, faShare,  faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { useUser } from '../../utils/user.context';
import { toast } from 'react-toastify';

interface foodProductData {
    category: string,
    detail: string
    image: string
    name: string
    price: number
    quantity: string
    restaurant_id: string
    _id: string
}

interface restaurantData {
    address: string
    city: string
    email: string
    menu_image: string
    password: string
    phoneno: string
    pincode: string
    restaurant_images: string[]
    restaurant_name: string
    _id: string
}

const ProductPage = () => {
    const [isHeaderSticky, setIsHeaderSticky] = useState<boolean>(false);
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState<string>("Overview");
    const [foodData, setFoodData] = useState<foodProductData[]>([])
    const [restaurantData, setRestaurantData] = useState<restaurantData>()
    const searchParams = new URLSearchParams(location.search)
    const restaurant_Id = searchParams.get("restaurant")
    const {token, setIsLoggedIn} = useUser()

    const getRestaurantProduct = async () => {
        try {
            const resData = await axios.get(`${BASE_URL + apiList.getfood}/?restaurant=${restaurant_Id}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            setFoodData(resData.data.food)
            setRestaurantData(resData.data.restaurant[0])
        }
        catch (error) {
            console.log("error in fetching food detail", error);
            if(error.response.status === 401){
                toast.error(error?.response?.data?.error, {
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
    useEffect(() => {
        getRestaurantProduct()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsHeaderSticky(true);
            } else {
                setIsHeaderSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    

    return (
        <div className='container mt-3 page-container'>
            <div className={`scrollable-content ${isHeaderSticky ? 'header-sticky' : ''}`}>
                <div className='row d-flex outer-div'>
                    <div className='col-6'>
                        <img src={BASE_URL + restaurantData?.restaurant_images[0]} className='food-product-banner zoom' alt='' />
                    </div>
                    <div className='col-3 d-flex flex-coolumn side-banner'>
                        <div>
                            <img src={BASE_URL + restaurantData?.restaurant_images[1]} className='food-product-side-banner zoom' alt=''/>
                        </div>
                        <div className='mt-3'>
                            <img src={BASE_URL + restaurantData?.restaurant_images[2]} className='food-product-side-banner zoom' alt=''/>
                        </div>
                    </div>
                    <div className='col-3'>
                        <img src={BASE_URL + restaurantData?.restaurant_images[3]} className='food-product-aside-banner zoom' alt='' />
                    </div>
                </div>

                <div className='fixed-header'>
                    <div className="row d-flex justify-content-between mt-3">
                        <div className="col-8 restaurant-name">{restaurantData?.restaurant_name.toUpperCase()}
                        </div>

                        <div className="col-2 d-flex justify-content-between align-items-center">
                            <div className='d-flex product-rating dining-rating justify-content-around'>
                                <div>4.5</div>
                                <div>
                                    <FontAwesomeIcon icon={faStar} style={{ width: '15px', height: '17px' }} />
                                </div>
                            </div>
                            <div>
                                <div className='font-14'>28</div>
                                <div className='fontrem-8'>Dining Reviews</div>
                            </div>
                        </div>
                        <div className="col-2 d-flex justify-content-between align-items-center">
                            <div className='d-flex product-rating justify-content-around'>
                                <div>4.5</div>
                                <div >
                                    <FontAwesomeIcon icon={faStar} style={{ width: '15px', height: '17px' }} />
                                </div>
                            </div>
                            <div>
                                <div className='font-14'>1,891</div>
                                <div className='fontrem-8 review-label'>delievery review</div>
                            </div>
                        </div>

                    </div>
                    <div className='overview-data' >
                        Beverages, Sandwich, Fast Food, Street Food
                    </div>
                    <div className='overview-data'>
                        {restaurantData?.city}
                    </div>
                    {/* </div> */}
                    <div className='rem-9 overview-data d-flex justify-content-start' >
                        <div className='open-close'>Open now  </div>
                        <div className='ms-1'> - 7am – 12midnight (Today)</div>
                        <div className='ms-1' id='info'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </div>
                        <Tooltip anchorSelect='#info' style={{
                            backgroundColor: "white",
                            color: "black",
                        }} >
                            <h4>Opening Hours</h4>
                            <div className='overview-bottom-title'>Mon-Sun:7am – 12midnight</div>
                        </Tooltip>
                    </div>
                    <div className='overview-data d-flex justify-content-between w-25 mt-3' >
                        <div className='bordered-div rounded d-flex justify-content-center align-items-center px-2'>
                            <FontAwesomeIcon icon={faDiamondTurnRight} className='zomato-color me-1' /> Direction</div>
                        <div className='bordered-div rounded d-flex justify-content-center align-items-center ms-3 px-2'>
                            <FontAwesomeIcon icon={faBookmark} className='zomato-color me-1' />Bookmark</div>
                        <div className='bordered-div rounded d-flex justify-content-center align-items-center ms-3 px-2'>
                            <FontAwesomeIcon icon={faShare} className='zomato-color me-1' />Share</div>


                    </div>


                    <div className='d-flex justify-content-between w-50 mt-5'>
                        <div onClick={() => {
                            setSelectedTab("Overview");
                        }}
                            style={{
                                color: selectedTab === "Overview" ? "#EF4F5F" : "inherit",
                                borderBottom: selectedTab === "Overview" ? "3px solid red" : "",
                                cursor: "pointer"
                            }}>Overview</div>

                        <div
                            onClick={() => {
                                setSelectedTab("Order Online");
                            }}
                            style={{
                                color: selectedTab === "Order Online" ? "#EF4F5F" : "inherit",
                                borderBottom: selectedTab === "Order Online" ? "3px solid red" : "",
                                cursor: "pointer"
                            }}>Order Online</div>
                        <div
                            onClick={() => {
                                setSelectedTab("Photos");
                            }}
                            style={{
                                color: selectedTab === "Photos" ? "#EF4F5F" : "inherit",
                                borderBottom: selectedTab === "Photos" ? "3px solid red" : "",
                                cursor: "pointer"
                            }}
                        >Photos</div>
                        <div
                            onClick={() => {
                                setSelectedTab("Menu");
                            }}
                            style={{
                                color: selectedTab === "Menu" ? "#EF4F5F" : "inherit",
                                borderBottom: selectedTab === "Menu" ? "3px solid red" : "",
                                cursor: "pointer"
                            }}
                        >Menu</div>
                    </div>
                    {/* <hr /> */}
                </div>

                {/* <hr /> */}
                {
                    selectedTab === "Overview" &&
                    <div className='d-flex justify-content-between'>
                        <div >
                            <h3>
                                About this place
                            </h3>
                            <div className='mt-4'>
                                <div className='overview-title'>Known For</div>
                                Its North Indian Dishes
                            </div>
                            <div className='mt-5'>
                                <h3 className='overview-title'>Menu</h3>
                                <div>
                                    <img src={BASE_URL + restaurantData?.menu_image} height='230' width='230'
                                        className='rounded' alt=''/>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='overview-title'>Popular Dishes</div>
                                <div className='rem-8'>
                                    Panneer Butter Masala, Authentic Punjabi Food, Butter Naan, Parathas, Tandoori Roti, Lassi
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='overview-title'>People Say This Place Is Known For</div>
                                <div className='rem-8'>
                                    Great Recommendations, Good Quantity, Tasty, Great Taste, Awesome Food, Good Food
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='overview-title'>Average Cost</div>
                                <div className='rem-8'>
                                    ₹700 for two people (approx.)
                                </div>
                            </div>
                            <div className='mt-5'>
                                <div className='overview-title'>More Info</div>
                                <div className='rem-8 d-flex justify-content-between w-50'>
                                    <div>
                                        <div className='d-flex'>
                                            <div>
                                                <FontAwesomeIcon icon={faCircleCheck} className='tick-icon' />
                                            </div>
                                            <div className='ms-1'>Breakfast</div>
                                        </div>
                                        <div className='d-flex'>
                                            <div>
                                                <FontAwesomeIcon icon={faCircleCheck} className='tick-icon' />
                                            </div>
                                            <div className='ms-1'>Takeaway Available</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='d-flex'>
                                            <div>
                                                <FontAwesomeIcon icon={faCircleCheck} className='tick-icon' />
                                            </div>
                                            <div className='ms-1'>Home Delivery</div>
                                        </div>
                                        <div className='d-flex'>
                                            <div>
                                                <FontAwesomeIcon icon={faCircleCheck} className='tick-icon' />
                                            </div>
                                            <div className='ms-1'>Indoor Seating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='mt-4'>
                                <div className='overview-bottom-title'>RELATED TO {restaurantData?.restaurant_name.toUpperCase()}, {restaurantData?.city.toUpperCase()}</div>
                                <div className='overview-bottom-data'>
                                    Restaurants in {restaurantData?.city}, {restaurantData?.city} Restaurant, Best {restaurantData?.city} Restaurant, Resturant in {restaurantData?.city}
                                    Quick Bites near me, Quick Bites in West {restaurantData?.city}, Quick Bites in Satellite, Tea Post Menu, Order food online in Satellite, Order food online in {restaurantData?.city},
                                    Order food online in West {restaurantData?.city}, New Year Parties in {restaurantData?.city}, Christmas' Special in {restaurantData?.city}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='overview-bottom-title'>RESTAURANTS AROUND {restaurantData?.city.toUpperCase()}</div>
                                <div className='overview-bottom-data'>
                                    Prahlad Nagar restaurants, Vejalpur restaurants, Bodakdev restaurants, Vastrapur restaurants
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='overview-bottom-title'>FREQUENT SEARCHES LEADING TO THIS PAGE</div>
                                <div className='overview-bottom-data'>
                                    {restaurantData?.restaurant_name}, {restaurantData?.restaurant_name} franchise cost, {restaurantData?.restaurant_name} franchise, {restaurantData?.restaurant_name} menu
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='overview-bottom-title'>TOP STORES</div>
                                <div className='overview-bottom-data'>
                                    {restaurantData?.city}
                                </div>
                            </div>

                        </div>
                        <div className='float-end h-100  d-inline-block p-3 w-75 contact-card'>
                            <div className='contact'>Call</div>
                            <div className='zomato-color rem-1'>{restaurantData?.phoneno}</div>
                            <div className='contact mt-4'>Direction</div>
                            <div className='comman-text'>{restaurantData?.address}</div>
                        </div>
                    </div>
                }

                {
                    selectedTab === "Order Online" &&
                    foodData && foodData.length > 0 &&
                    foodData.map((food: foodProductData, index: number) => {
                        return (

                                <Link to={`/foodproduct?restaurant=${food.restaurant_id}&fooditem=${food._id}`} className='link-div'>
                                    <div className='container float-end'>
                                        <div className='row d-flex my-3 w-75 float-end'>
                                            <div className='col-2'>
                                                <img src={BASE_URL + food.image} className='rounded cursor-pointer' height='100' width='100' alt='' />
                                            </div>
                                            <div className='col-10 d-flex flex-column justify-content-between'>
                                                <div className='food-title cursor-pointer'>{food.name}</div>
                                                <div className='rem-1'>₹{food.price}</div>
                                                <div className='rem-9'>{food.detail}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                        )
                    })

                }
                {
                    selectedTab === "Menu" &&
                    <img src={BASE_URL + restaurantData?.menu_image} className='rounded' height='200' width='200' alt='' />
                }

                {
                    selectedTab === "Photos" &&
                    (
                        <>
                            {
                                restaurantData?.restaurant_images &&
                                restaurantData?.restaurant_images.map((image, i) => {
                                    return (
                                        <img className='m-3 rounded' src={BASE_URL + image} height='150' width='150' alt=''/>
                                    )
                                })
                            }
                            {
                                foodData &&
                                foodData.map((food, i) => {
                                    return (
                                        <img className='m-3 rounded' src={BASE_URL + food.image} height='150' width='150' alt=''/>
                                    )
                                })
                            }
                        </>
                    )
                }



            </div>

        </div>
    )
}

export default ProductPage