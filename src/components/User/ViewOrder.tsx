import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL, apiList } from '../../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faLocation, faMapMarker, faTruck } from '@fortawesome/free-solid-svg-icons'
import "../../assets/css/viewOrder.css"
import { useUser } from '../../utils/user.context'
import { toast } from 'react-toastify'


interface IUser {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    phoneno: number,
    city: string,
    address: string,
    pincode: number
}

interface IFood {
    _id: string,
    name: string,
    category: string,
    image: string,
    detail: string,
    price: string,
    quantity: string,
    restaurant_id: string,
}
interface IItem {
    foodID: string,
    restaurantID: string,
    quantity: number,
    price: number,
    subTotal: number,
    _id: string,
}

interface IOrder {
    delievery_address: string,
    grand_total: number,
    orderDate: Date,
    order_items: IItem[],
    order_status: string,
    payment_method: string,
    user_id: string,
    _id: string,
}

interface IOrderWithItem {
    order: IOrder[],
    item: IItem[]
}

const ViewOrder = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const navigate = useNavigate();
    const orderId = searchParams.get("order")
    const userId = searchParams.get("user")
    const orderStatus = searchParams.get("orderstatus")
    const { token, setToken, setIsLoggedIn } = useUser()

    const [userData, setUserData] = useState<IUser[]>([]);
    const [foodData, setFoodData] = useState<IFood[]>([]);
    // const [orderItems, setOrderItems] = useState<IOrderWithItem[]>([])
    const [order, setOrder] = useState<IOrder[]>([])

    const fetchOrders = async () => {
        try {
            const orderRes = await axios.get(`${BASE_URL + apiList.fetchOrders}/?order=${orderId}&user=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setFoodData(orderRes.data.data.foodData);
            setUserData(orderRes.data.data.user_data);
            setOrder(orderRes.data.data.orderWithItem)
        }
        catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
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
            console.log("fetch order error", err);
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])

    const handleCancelOrder = async (orderId: string) => {
        try {
            if (window.confirm("Are You Sure You Want To Cancel This Order")) {
                const cancelRes = await axios.post(`${BASE_URL + apiList.cancelorder}/${orderId}`,null,{
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                toast.success(cancelRes.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                navigate({
                    pathname: "/orders",
                    search: `?user=${userId}`
                })
            }
        }
        catch (err) {
            console.log("error in order cancellation", err);
            if (err.response.status === 401 || err.response.status === 403) {
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
        }
    }

    return (
        <div className='w-100 pt-3'>
            <div className='d-flex w-100 justify-content-evenly'>
                <div className='width-45'>
                    {
                        userData &&
                        <div className=' border rounded p-3 shadow' >
                            <div className='d-flex justify-content-between pt-2'>
                                <div className='d-flex justify-content-between width-40'>
                                    <div className='zomato-color'><FontAwesomeIcon icon={faTruck} style={{ width: "35px", height: "25px" }} /></div>
                                    <div className='font-19-600 '>Shipping Address</div>
                                </div>
                                {/* <div>{userData[0].pincode}</div> */}
                                <div className='d-flex justify-content-between text-primary'>
                                    <div><FontAwesomeIcon icon={faMapMarker} style={{ width: "35px", height: "25px" }} /></div>
                                    <div>383453</div>
                                </div>

                            </div>
                            <hr />
                            <div className='address'>
                                <div className='fw-bold'>{userData[0]?.firstname} {userData[0]?.lastname}</div>
                                {/* <div className='font-19-600'> Vishal Sarvaiya</div> */}
                                {/* <div>Nikol, Ahmedabad</div> */}
                                <div className='font-monospace'>{userData[0]?.address}</div>
                                <div className='d-flex align-items-center'><div className='fw-bold'>Email: </div><div className='ms-1 font-monospace'> {userData[0]?.email}</div></div>
                            </div>
                        </div>
                    }
                </div>

                <div className='width-45'>
                    {
                        userData &&
                        <div className='border rounded p-3 shadow'>
                            <div className='d-flex justify-content-between pt-2'>
                                <div className='d-flex justify-content-between width-40'>
                                    <div className='zomato-color'><FontAwesomeIcon icon={faCreditCard} style={{ width: "35px", height: "25px" }} /></div>
                                    <div className='font-19-600 '>Payment Method</div>
                                </div>
                            </div>
                            <hr />
                            <div className='address'>
                                <div className='heading d-flex align-items-center justify-content-center'>Cash On Delievery</div>
                            </div>
                        </div>
                    }
                </div>
            </div>


            {
                order.map((order, i) => {
                    return (
                        <div key={i} className='width-95 mx-auto'>
                            <div key={i} className='d-flex flex-column justify-content-between m-2 p-3 border shadow rounded'>
                                <div className='d-flex justify-content-between'>
                                    <div className='bg-primary rounded text-white p-1 d-flex justify-content-center align-items-center'>{order._id}</div>
                                    <div>
                                        {/* <button className='btn btn-success' onClick={()=>{setViewOpen(true)}}>View</button> */}
                                        {
                                            orderStatus === "Open" &&
                                            <button className='btn-cancel' onClick={() => { handleCancelOrder(order._id) }}>Cancel Order</button>
                                        }
                                    </div>
                                </div>
                                <hr />
                                {
                                    order.order_items.map((orderitem, i) => {

                                        const matchedFood: IFood[] = []
                                        foodData.map((food) => {
                                            if (food._id === orderitem.foodID) {
                                                matchedFood.push(food)
                                            }
                                        })
                                        return (
                                            <div>
                                                <div className='d-flex justify-content-between m-2'>
                                                    <div className='d-flex justify-content-between food-content'>
                                                        <div>
                                                            <img src={BASE_URL + matchedFood[0].image} height='100' width="100" />
                                                        </div>
                                                        <div className='width-70'>
                                                            <div className='font-19-600'>{matchedFood[0].name}</div>
                                                            <div>{matchedFood[0].detail}</div>
                                                        </div>
                                                    </div>
                                                    <div className='me-3'>
                                                        <div><span className='font-19-600'>Price : </span>₹{orderitem.price}</div>
                                                        <div><span className='font-19-600'>Quantity:</span> {orderitem.quantity}</div>
                                                        <div><span className='font-19-600'>SubTotal: </span>₹{orderitem.subTotal}</div>
                                                    </div>
                                                </div>
                                                <hr />
                                            </div>
                                        )
                                    })
                                }
                                <hr />
                                <div className='d-flex justify-content-between'>
                                    <div className='fs-3'>
                                        <span className='font-19-600 fs-2'>Ordered On: </span>{order.orderDate.toString().slice(0, 10)}
                                    </div>
                                    <div>
                                        <span className='font-19-600 fs-2'>Grand Total: ₹{order.grand_total} </span>
                                    </div>
                                </div>
                            </div>




                            <hr />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ViewOrder