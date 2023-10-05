import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL, apiList } from '../../utils/api';
import "../../assets/css/restaurantDashboard.css"
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/user.context';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCutlery, faPencil, faShoppingBag, faTrash } from '@fortawesome/free-solid-svg-icons';

interface FoodItem {
    image: string;
    name: string;
    category: string;
    price: number;
    detail: string;
    _id: string,
    restaurant_id: string,
}

interface orderItem {
    OrderID: string,
    ProductID: string,
    Quantity: number,
    Subtotal: number,
    UnitPrice: number,
    orderDate: Date
}

const RestaurantDashboard = () => {
    useEffect(() => {
        getFoodDetail()
    }, [])
    const userId = localStorage.getItem("userId")
    const [foodData, setFoodData] = useState<FoodItem[]>([])
    const [orderData, setOrderData] = useState<orderItem[]>([])
    const [orderedfoodData, setOrderedFoodData] = useState<FoodItem[]>([])
    const [status, setStatus] = useState<string>("Open")
    const navigate = useNavigate()
    const { token, setIsLoggedIn } = useUser();

    const [content, setContent] = useState<string>("fooditems")
    // const searchParams = new URLSearchParams(location.search)
    // const restaurantId = searchParams.get("restaurant")

    const getFoodDetail = async () => {
        try {
            const res = await axios.get(`${BASE_URL + apiList.getfood}/?restaurant=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setFoodData(res.data.food)
        }
        catch (err) {
            console.log("error in fetching food detail", err);
            if (err.response.status === 401 || err.response.status === 403) {
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

    const handleDelete = async (id: FoodItem["_id"], name: FoodItem["name"]) => {
        if (window.confirm(`Are you Sure You Want To Delete ${name}`)) {
            try {
                const res = await axios.delete(`${BASE_URL + apiList.deletefood}/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                getFoodDetail();
            }
            catch (err) {
                console.log("Food Delete Error", err);
                toast.error(err?.response?.data?.error, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                if (err.response.status === 401 || err.response.status === 403) {
                    setIsLoggedIn("")
                }
            }
        }
        else {
            return
        }
    }



    const showOrders = async (orderStatus: string) => {
        try {
            setStatus(orderStatus);
            setContent("orders")
            const orderRes = await axios.get(`${BASE_URL + apiList.showorder}/?restaurant=${userId}&status=${orderStatus}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setOrderData(orderRes.data.data.orderData)
            setOrderedFoodData(orderRes.data.data.foodData)
        }
        catch (err) {
            if (err.response.status === 401 || err.response.status === 403) {
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
            console.log("show order error", err);
        }
    }

    return (
        <div className='d-flex w-100 justify-content-between main-div'>
            <div className='sidebar'>
                <div className={content === "fooditems" ? "sidebar-title selected" : "sidebar-title"} onClick={() => { setContent("fooditems") }}>
                    <div className='sidebar-title-container'>
                        <FontAwesomeIcon icon={faCutlery} />
                        <div>Food Items</div>
                    </div>
                </div>
                <div className={content === "orders" ? "sidebar-title selected" : "sidebar-title"} onClick={() => { showOrders("Open") }}>
                    <div className='sidebar-title-container'>
                        <FontAwesomeIcon icon={faShoppingBag} />
                        <div> Orders</div>
                    </div>
                </div>
            </div>

            {
                content === "fooditems" &&
                <div className='content'>
                    <div className="row px-4  ">
                        <div className="col-2 table-heading">Image</div>
                        <div className="col-2 table-heading">Name</div>
                        <div className="col-2 table-heading">Category</div>
                        <div className="col-1 table-heading">Price</div>
                        <div className="col-2 table-heading">Detail</div>
                        <div className="col-2 table-heading">Actions</div>
                        <div className='col-1'><button className='btn btn-primary' onClick={() => { navigate("/restaurant/fooditemform") }} >Add</button></div>

                    </div>
                    <hr />
                    {foodData &&
                        foodData?.map((food: FoodItem, index: number) => {
                            return (
                                <div key={index} className='p-1'>
                                    <div className="row p-3 item-row">
                                        <div className="col-2">
                                            <img src={BASE_URL + food.image} height='120' width='120' className='rounded' alt='' />
                                            {/* <img src= {require(`${BASE_URL+food.image}`)} height='150' width='150' /> */}
                                            {/* <img src= {require(`${BASE_URL+food.image}`)} {`${BASE_URL+food.image}`} height='150' width='150' /> */}
                                        </div>
                                        <div className="col-2 d-flex justify-content-center h6">{food.name}</div>
                                        <div className="col-2 d-flex justify-content-center color-5e">{food.category}</div>
                                        <div className="col-1 d-flex justify-content-center color-5e">{food.price}</div>
                                        <div className="col-2 d-flex justify-content-center detail color-5e">{food.detail.slice(0, 60) + "..."}</div>
                                        <div className="col-3 d-flex justify-content-evenly">
                                            <div>
                                                <Link className='link-div' to={`/restaurant/fooditemform/?fooditem=${food._id}`}>
                                                    <Button className='action-btn ' variant='success'>
                                                        <FontAwesomeIcon icon={faPencil} />
                                                        Edit</Button>
                                                </Link>
                                            </div>
                                            <div>
                                                <Button variant='danger' className='action-btn' onClick={(e) => handleDelete(food._id, food.name)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                    Delete</Button>
                                            </div>
                                            {/* <button onClick={(e) => handleDelete(food._id, food.name)}>Delete</button> */}
                                        </div>
                                    </div>
                                    {/* <hr /> */}
                                </div>
                            )
                        }
                        )}

                </div>
            }

            {
                content === "orders" &&
                <div className='content'>
                    <div className='fixed-header'>
                        <div className="row d-flex justify-content-between">
                            <div className='d-flex justify-content-between w-50 mt-2 ms-3'>
                                <div onClick={() => { showOrders("Open"); }}
                                    className={status === "Open" ? "selected-status" : "cursor-pointer"}>Open</div>

                                <div onClick={() => { showOrders("Delivered"); }}
                                    className={status === "Delivered" ? "selected-status" : "cursor-pointer"}>Delivered</div>

                                <div onClick={() => { showOrders("Cancelled"); }}
                                    className={status === "Cancelled" ? "selected-status" : "cursor-pointer"}>Cancelled</div>
                            </div>
                        </div>
                    </div>

                    {
                        orderData.map((order, i) => {
                            const foodItem = orderedfoodData.find(food => food._id.toString() === order.ProductID.toString());
                            if (foodItem) {
                                return (
                                    <div key={i}>
                                        <div key={i} className='d-flex flex-column justify-content-between m-2 p-3 border'>
                                            <div className='d-flex justify-content-between'>
                                                <div className='bg-danger rounded text-white p-1'>{order.OrderID}</div>
                                                <div>
                                                    <button className='btn btn-success'>View</button>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='d-flex justify-content-between'>
                                                <div className='d-flex justify-content-between food-content'>
                                                    <div>
                                                        <img src={BASE_URL + foodItem.image} height='150' width="150" alt=''/>
                                                    </div>
                                                    <div className='width-70'>
                                                        <div className='font-19-600'>{foodItem.name}</div>
                                                        <div>{foodItem.detail}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div><span className='font-19-600'>Price : </span>₹{foodItem.price}</div>
                                                    <div><span className='font-19-600'>Quantity:</span> {order.Quantity}</div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <span className='font-19-600'>Ordered On: </span>{order.orderDate.toString().slice(0, 10)}
                                                </div>
                                                <div>
                                                    <span className='font-19-600'>Order Total: {order.Subtotal} </span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            }
                        })
                    }

                </div>
            }
        </div>


    )
}

export default RestaurantDashboard

























// return(
//     <div>

//     <div key={index} className='d-flex flex-column justify-content-between m-2 p-3 border'>
//         <div className='d-flex justify-content-between'>
//             <div>{order.OrderID}</div>
//             <div>
//                 <button>View Order</button>
//             </div>
//         </div>
//         <div>

//         </div>
//         <div className='d-flex justify-content-between'>
//             <div>
//                 Ordered On: {order.orderDate.toString().slice(0,10)}
//             </div>
//             <div>
//                 Order Total: {order.Subtotal}
//             </div>
//         </div>
//     </div>
//         <hr/>
//     </div>
//     )
