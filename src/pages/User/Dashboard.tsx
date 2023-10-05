import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL, apiList } from '../../utils/api'
import "../../assets/css/dashboard.css"
import Product from '../../components/User/Product'
import { useUser } from '../../utils/user.context'
import { Rings } from 'react-loader-spinner'
import { toast } from 'react-toastify'
interface RestaurantData {
        restaurant_name : string,
        email: string,
        phoneno: number,
        restaurant_images: string[],
        menu_image: string,
        city: string,
        pincode: string,
        address: string,
        _id:string
}
const Dashboard = () => {
  const { isLoggedIn, setIsLoggedIn, token } = useUser();
  const [restaurantData, setRestaurantData] = useState<RestaurantData[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  const [searchParams] = useSearchParams(location.search);
  let cityName = searchParams.get("city")
  let restaurantId = searchParams.get("restaurant")

  useEffect(() => {
    getRestaurantDetail();
  }, [restaurantId,location.pathname, location.search,cityName]);

  const getRestaurantDetail = async () => {
    console.log("get detil called")
    setLoading(true)
    try {
      let res; 
      cityName ?
      res = await axios.get(`${BASE_URL + apiList.getrestaurant}/?city=${cityName}`,
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      :
      restaurantId?
      res = await axios.get(`${BASE_URL + apiList.getrestaurant}/?restaurant=${restaurantId}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      :
      res = await axios.get(`${BASE_URL + apiList.getrestaurant}/?user=${isLoggedIn}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      res.data && setLoading(false)
      setRestaurantData(res.data)
      if(res.data.length === 0){
        setNoData(true)
      }
    }
    catch (err) {
      console.log("error in fetching restaurant detail", err);
      if(err?.response?.data?.error === "jwt expired"){

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
    getRestaurantDetail()
  }, [])

  return (
loading ?
<Rings 
 height="80"
 width="80"
 color="#4fa94d"
 radius="6"
 wrapperStyle={{}}
 wrapperClass="d-flex justify-content-center"
 visible={true}
 ariaLabel="rings-loading"/>
:


    <div>
      <div className="container">
        {
          noData === true ?
           <div className='nodata-div'>
            <div className='font-600'>Sorry!</div>
            <div className='font-400'>No Restaurants Found In {cityName}</div>
            </div>
          :
        <div className="row d-flex justify-content-start">
          {
            restaurantData && restaurantData.length > 0 &&
            restaurantData.map((restaurant: RestaurantData, index: number) => {
              return (
                <Product restaurant={restaurant}/>                      
              )
            })
          }
        </div>
}
      </div>
    </div>

  )
}

export default Dashboard