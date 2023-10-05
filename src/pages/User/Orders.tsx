import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { BASE_URL, apiList } from '../../utils/api';
import { Link } from 'react-router-dom';
import "../../assets/css/orders.css"
import { useUser } from '../../utils/user.context';
import { toast } from 'react-toastify';

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

const Orders = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get("user")
  const [userData, setUserData] = useState<IUser>();
  const [foodData, setFoodData] = useState<IFood[]>([]);
  const [order, setOrder] = useState<IOrder[]>([])
  const [status, setStatus] = useState<string>("Open")
  const {token,  setIsLoggedIn} = useUser()

  const fetchOrders = async (orderStatus: string) => {
    try{
      setStatus(orderStatus)
      const orderRes = await axios.get(`${BASE_URL + apiList.fetchOrders}/?user=${user}&status=${orderStatus}`,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
    })
      setFoodData(orderRes.data.data.foodData);
      setUserData(orderRes.data.data.user_data);
      setOrder(orderRes.data.data.orderWithItem)
    }
    catch(err){
      if(err.response.status === 401 || err.response.status === 403){
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

  useEffect(() => {
    fetchOrders("Open")
  }, [])


  return (
    <div className='container '>
      <div className='fixed-header rounded order-header'>
        <div className="row d-flex justify-content-between">
          <div className='d-flex justify-content-between w-50 mt-2 ms-3'>
            <div onClick={() => { fetchOrders("Open"); }}
              className={status === "Open" ? "selected-status" : "cursor-pointer"}>Open</div>

            <div onClick={() => { fetchOrders("Delivered"); }}
              className={status === "Delivered" ? "selected-status" : "cursor-pointer"}>Delivered</div>

            <div onClick={() => { fetchOrders("Cancelled"); }}
              className={status === "Cancelled" ? "selected-status" : "cursor-pointer"}>Cancelled</div>
            {/* <div className="border-animated"></div> */}
          </div>
        </div>
      </div>

      {
        order.map((order, i) => {
          return (
            <div key={i}>

              <div className='d-flex flex-column justify-content-between m-2 p-3 border rounded individual-order'>
                <div className='d-flex justify-content-between'>
                  <div className='bg-danger rounded text-white p-1'>{order._id}</div>
                  <div>
                    <Link to={`/vieworder/?order=${order._id}&user=${user}&orderstatus=${status}`}>
                      <button className='btn btn-success'>View</button>
                    </Link>

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
                              <img src={BASE_URL + matchedFood[0].image} height='100' width="100" alt=''/>
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
                  <div className='fs-2'>
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

export default Orders