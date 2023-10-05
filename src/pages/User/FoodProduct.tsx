import React, { useState, useEffect } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BASE_URL, apiList } from '../../utils/api'
import axios from 'axios'
import "../../assets/css/foodProduct.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
    import 'slick-carousel/slick/slick.css';
    import 'slick-carousel/slick/slick-theme.css';
import { NavLink } from 'react-router-dom'
import { useUser } from '../../utils/user.context'
import { toast } from 'react-toastify'


interface selectedFood {
    category: string
    detail: string
    image: string
    name: string
    price: string
    quantity: string
    restaurant_id: string
    _id: string
}

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
interface OtherRestaurantFood {
    category: string,
    detail: string
    image: string
    name: string
    price: number
    quantity: string
    restaurant_id: string
    _id: string
}

const dummy = {
    foodID: "64e470a4cb983acb410841b3",
    restaurantID: "64e357c372594e19a87dcdd8",
    quantity: 3,
    price: 499,
    subTotal: (3 * 499)
}



const FoodProduct = () => {

    const location = useLocation()
    const [selectedFood, setSelectedFood] = useState<selectedFood>()
    const [restaurantFoodData, setRestaurantFoodData] = useState<foodProductData[]>([])
    const [restaurantData, setRestaurantData] = useState<restaurantData>()
    const [quantity, setQuantity] = useState<number>(1)
    const [otherRestaurantData, setOtherRestaurantData] = useState<OtherRestaurantFood[]>([])
    const userId = localStorage.getItem("userId")
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    // const searchParams = new URLSearchParams(location.search)
    const [searchParams ] = useSearchParams(location.search)
    const restaurantId = searchParams.get("restaurant")
    const foodId = searchParams.get("fooditem")
    const {token,setIsLoggedIn } = useUser();
    const getRestaurantProduct = async () => {
        try {
            // const resData = await axios.get(`${BASE_URL + apiList.getfood}/${selectedFood.restaurant_id}`)
            const resData = await axios.get(`${BASE_URL + apiList.getfood}/?restaurant=${restaurantId}&fooditem=${foodId}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            }
)
            setSelectedFood(resData.data.food[0])
            setRestaurantFoodData(resData.data.allFoodDetailsExceptMain)
            setRestaurantData(resData.data.restaurant[0])
            setOtherRestaurantData(resData.data.allFoodDetailsAllRestaurantExceptMain)
        }
        catch (error) {
            console.log("error in fetching food detail", error);
            if(error.response.status === 401){
                toast.error(error.response.data.error, {
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
    }, [searchParams, location.search])

    const slickSettings = {
        autoplaySpeed: 2000,
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Number of slides to show at a time
        slidesToScroll: 1, // Number of slides to scroll on navigation
        className:"center",
        centerMode: true,
        // centerPadding: "60px",
    };



    const handleOrder = async (food: selectedFood) => {
        if (!userId) {
            toast.warning("session Expired", {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
          
        }
        const foodData = {
            foodID: food._id,
            restaurantID: food.restaurant_id,
            quantity: quantity,
            price: food.price,
            subTotal: quantity * JSON.parse(food.price)
        }

        const dummyarray = []

        dummyarray.push(foodData)
        dummyarray.push(dummy)

        const data = {
            foodData: foodData,
            // foodData:dummyarray,
            userId: userId,
            payment_method: "Cash On Delievery",
            order_status: "Open",
            cart_order: false
        }
        try {
            const orderRes = await axios.post(BASE_URL + apiList.placeorder, data,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            }
)
            if (orderRes.data.success) {
                toast.success(orderRes.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
            }
        }
        catch (error) {
            console.log("error in order placing", error);
            if(error.response.status === 401){
                toast.error(error.response.data.error, {
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

    const handleCart = async (food: selectedFood) => {
        if (!userId) {
            toast.warning("Session Expired", {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
            return
        }
        const foodData = {
            foodID: food._id,
            restaurantID: food.restaurant_id,
            quantity: quantity,
            price: food.price,
            subTotal: quantity * JSON.parse(food.price),

        }

        const data = {
            foodData: foodData,
            userId: userId,
        }
        try {
            const cartRes = await axios.post(BASE_URL + apiList.addtocart, data,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            toast.success(cartRes?.data, {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
            
        }
        catch (err) {
            if(err.response.status === 401 || err.response.status === 403){
                toast.error(err.response.data.error, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                setIsLoggedIn("")
            }
            console.log("error in Adding to Cart", err);
        }
    }

    return (
        <div>
            {selectedFood &&
                <div className='container pt-5'>
                    <div className="row  d-flex justify-content-between">
                        <div className="col-5">
                            <div>
                                <img alt='' src={BASE_URL + selectedFood.image} className='rounded main-image' height='415' width='415' />
                            </div>
                        </div>
                        <div className="col-7 d-flex flex-column justify-content-evenly">
                            <div className='title'>{selectedFood.name}</div>
                            <div className='food-data'>{selectedFood.detail}</div>
                            <div className='food-data d-flex'>
                                <div className="zomato-color">
                                    Special Price:
                                </div>
                                <div className='ms-2'>
                                    ₹{selectedFood.price}
                                </div>
                            </div>
                            <div className='food-data'>{selectedFood.category}</div>
                            <div className='d-flex align-items-center'>

                                <div>Select quantity:</div>
                                <div className='ms-2'>
                                    <select value={quantity} className='form-control' onChange={(e) => setQuantity(JSON.parse(e.target.value))}>
                                        {
                                            number.map(num => <option value={num}>{num}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faLocationDot} className='me-2 zomato-color' />
                                {restaurantData?.restaurant_name.toUpperCase()}
                            </div>
                            <div className='d-flex justify-content-between w-50'>
                                <div>
                                    <button className="btn btn-success add-cart-btn"
                                        onClick={() => { handleCart(selectedFood) }}
                                    > Add to Cart</button>
                                </div>
                                <div>
                                    <button className="order-btn ms-3"
                                        onClick={() => { handleOrder(selectedFood) }}
                                    >Order Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="heading">More From {restaurantData?.restaurant_name.toUpperCase()}</div>
                    <div className="row">
                       <Slider {...slickSettings} >
                        {
                            restaurantFoodData.map((restaurantFood, index) => {
                                return (
                                    <div className="col-3 px-3 py-2 m-1 d-flex flex-column rounded-4 foodBox" key={index}>
                                        <Link to={`/foodproduct?restaurant=${restaurantFood.restaurant_id}&fooditem=${restaurantFood._id}`}
                                            target='_blank' className='link-div'
                                            >
                                            <div className='d-flex justify-content-center'>
                                                <img alt='' className='rounded-4 m-1' src={BASE_URL + restaurantFood.image} height='200' width='240' />
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <div>{restaurantFood.name}</div>

                                                <div className='rating d-flex justify-content-between px-1'>
                                                    <div>4.5</div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faStar} style={{ width: '13px', height: '15px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <div className='description'>{restaurantFood.detail.slice(0, 15) + "..."}</div>
                                                <div className='description'>{restaurantFood.price + " for one"}</div>
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                <div className='fontrem-8'>20 Min</div>
                                            </div>
                                            <hr />
                                            <div className='d-flex justify-content-between'>
                                                <div className='d-flex align-items-center me-2'>
                                                    <img src='https://b.zmtcdn.com/data/o2_assets/0b07ef18234c6fdf9365ad1c274ae0631612687510.png?output-format=webp'
                                                        height='17' width='45' alt='' />
                                                </div>
                                                <div className='safety-description'>Follows all Max Safety measures to ensure your food is safe</div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                    </div>
                    <hr />

                    <div className="heading">You might be interested in</div>
                    <div className="row mb-5">
                        <Slider {...slickSettings} >
                        {
                            otherRestaurantData.map((otherRestaurantFood, index) => {
                                return (

                                        <div className="col-3 px-3 py-2 m-1 d-flex flex-column rounded-4 foodBox" key={index}>
                                            <Link to={`/foodproduct?restaurant=${otherRestaurantFood.restaurant_id}&fooditem=${otherRestaurantFood._id}`}
                                                target='_blank'
                                                className='link-div'>
                                                <div className='d-flex justify-content-center'>
                                                    <img className='rounded-4 m-1' src={BASE_URL + otherRestaurantFood.image} height='220' width='300' alt='' />
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <div>{otherRestaurantFood.name}</div>

                                                    <div className='rating d-flex justify-content-between px-1'>
                                                        <div>4.5</div>
                                                        <div>
                                                            <FontAwesomeIcon icon={faStar} style={{ width: '13px', height: '15px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='description'>{otherRestaurantFood.detail.slice(0, 15) + "..."}</div>
                                                    <div className='description'>{otherRestaurantFood.price + " for one"}</div>
                                                </div>
                                                <div className='d-flex justify-content-end'>
                                                    <div className='fontrem-8'>20 Min</div>
                                                </div>
                                                <hr />
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d-flex align-items-center me-2'>
                                                        <img src='https://b.zmtcdn.com/data/o2_assets/0b07ef18234c6fdf9365ad1c274ae0631612687510.png?output-format=webp'
                                                            height='17' width='45' alt=''/>
                                                    </div>
                                                    <div className='safety-description'>Follows all Max Safety measures to ensure your food is safe</div>
                                                </div>
                                            </Link>
                                        </div>
                                )
                            })
                        }
                        </Slider>
                    </div>

                </div>
            }
        </div >
    )
}

export default FoodProduct


