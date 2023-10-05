import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL, apiList } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import CartOrder from '../../components/User/CartOrder';
import { useUser } from '../../utils/user.context';
import { toast } from 'react-toastify';

interface Cartdata {
    _id: string,
    user_id: string,
    cart_items: string[],
    grand_total: number,
    __v: number,
}
interface CartItem {
    _id: string;
    foodID: string;
    quantity: number;
    restaurantID: string;
    price: number;
    subTotal: number;
}

interface FoodItem {
    category: string,
    detail: string,
    image: string,
    name: string,
    price: string,
    quantity: string,
    restaurant_id: string,
    __v: string,
    _id: string,
}

const Cart = () => {
    const [cartData, setCartData] = useState<Cartdata>()
    const [cartItem, setCartItem] = useState<CartItem[]>([])
    const [foodData, setFoodData] = useState<FoodItem[]>([])
    const [cartEmpty, setCartEmpty] = useState<boolean>(false)
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const userId = searchParams.get("user")
    const { token, setIsLoggedIn } = useUser();

    const fetchCartData = async () => {
        try {
            const cartRes = await axios.get(`${BASE_URL + apiList.fetchcartdata}/?user=${searchParams.get("user")}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log("food", cartRes.data.foodData[0][0].name);

            setCartData(cartRes.data.cartData[0])
            setCartItem(cartRes.data.cartData[0].cart_items)
            cartRes.data.cartData[0].cart_items.length === 0 && setCartEmpty(true)
            const extractedFoodData = cartRes.data.foodData.flatMap((subArray: FoodItem[]) => subArray);
            setFoodData(extractedFoodData);

        }
        catch (err) {
            console.log("error in cart data fetching", err);
            if (err?.response?.status === 401) {
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
            // setCartData()
            setCartItem([])
            setFoodData([]);
        }

    }

    useEffect(() => {
        fetchCartData()
    }, [])

    const handleCartOrder = async () => {
        const foodItemArray: CartItem[] = []
        if (cartItem && cartItem.length > 0) {
            for (let i = 0; i < cartItem.length; i++) {
                foodItemArray.push(cartItem[i])
            }
        }
        const data = {
            foodData: cartItem,
            userId: userId,
            payment_method: "Cash On Delievery",
            order_status: "Open",
            cart_order: cartData?._id
        }

        try {
            const orderRes = await axios.post(BASE_URL + apiList.placeorder, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            )
            if (orderRes.data.success) {
                fetchCartData()
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
        catch (err) {
            console.log("error in placing cart order", err);
            toast.error(err.response.data.error, {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
            if (err?.response?.status === 401) {
                setIsLoggedIn("")
            }
        }
    }
    return (
        <div className='container border mt-3'>
            {cartItem &&
                cartItem.map((item, index) => {
                    return (
                        <div key={index}>
                            {
                                foodData &&
                                foodData.map((fooditem, i) => {
                                    if (fooditem._id === item.foodID) {
                                        return (
                                            <CartOrder
                                                name={fooditem.name}
                                                image={fooditem.image}
                                                price={fooditem.price}
                                                subTotal={item.subTotal}
                                                grand_total={cartData?.grand_total ? cartData.grand_total : 0}
                                                foodID={item.foodID}
                                                quantity={item.quantity}
                                                restaurantID={item.restaurantID}
                                                detail={fooditem.detail}
                                                user_id={cartData?.user_id ? cartData.user_id : ""}
                                                cartId={cartData?._id ? cartData._id : ""}
                                                fetchCartData={fetchCartData}
                                            />

                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })}
            {cartItem.length !== 0 || cartEmpty === true ?
                <div className='d-flex justify-content-between heading align-items-center'>
                    <div>Grand Total: ₹{cartData?.grand_total !== 0 ? cartData?.grand_total : 0}</div>
                    <button className='place-order-btn' onClick={() => { handleCartOrder() }}>Place Order</button>
                </div>
                :
                <div className='d-flex justify-content-center empty-cart align-items-center'>
                    <div className=''>Your Cart Is Empty !</div>
                </div>
            }

        </div>

    )
}

export default Cart
