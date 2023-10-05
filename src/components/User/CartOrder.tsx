import React, {useState } from 'react'
import { BASE_URL, apiList } from '../../utils/api'
import "../../assets/css/cartOrder.css"
import axios from 'axios'
import { useUser } from '../../utils/user.context'
import { toast } from 'react-toastify'

interface CartOrderData {
    name: string,
    image: string,
    price: string,
    subTotal: number,
    grand_total: number,
    foodID: string,
    quantity: number,
    restaurantID: string,
    detail: string,
    user_id: string,
    cartId: string,
    fetchCartData: () => void
}

const CartOrder: React.FC<CartOrderData> = ({
    name,
    image,
    price,
    foodID,
    quantity,
    restaurantID,
    detail,
    subTotal,
    grand_total,
    user_id,
    cartId,
    fetchCartData
}) => {
    const qtyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [qty, setQty] = useState<number>(quantity)
    const date = new Date()
    const futureTime = new Date(date.getTime() + 45 * 60 * 1000);
    let hours = futureTime.getHours()
    let minutes = futureTime.getMinutes()
    const {token, setIsLoggedIn} = useUser()
    let delieveryCost = Math.floor(JSON.parse(price) / 3);
    
    const updatecart = async (quantity: number) => {
        let tempQty
        if (quantity === 0 ) {
            tempQty = qty
            setQty(qty)
            toast.warning("Quantity Can't Be Less Than 1", {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              })
        }
        else if(quantity === 11){
            tempQty = qty
            setQty(qty)
            toast.warning("Quantity Can't Be Greater Than 10", {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              })
        }
        else {
            tempQty = quantity
            setQty(quantity)
        
        const data = {
            cartId: cartId,
            foodID: foodID,
            quantity: tempQty,
            price: price,
            grand_total: grand_total
        }
        try{
            const cartUpdateRes = await axios.put(BASE_URL + apiList.updatecart, data,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            toast.success(cartUpdateRes?.data?.message, {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              })
            fetchCartData()
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
            console.log("cart update error",err);
        }
    }
}

    const handleRemove = async(foodID: string) =>{
        try{
            await axios.delete(`${BASE_URL+apiList.deletecartitem}/${cartId}/${foodID}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            fetchCartData()
        }
        catch(err){
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
            console.log("cart update error",err);
        }
    }

    return (

            <div className='container'>
                <div className="row  m-2 d-flex justify-content-between">
                    <div className="col-3">
                        <img src={BASE_URL + image} height='150' width='150' alt='' className='rounded' />
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-evenly">
                        <div className='cart-food-title'>{name}</div>
                        <div className='cart-detail-font'>{detail}</div>
                        <div className='price-heading'>₹{price}</div>
                        <div className='subtotal-heading'>Sub Total: ₹{subTotal}</div>
                    </div>
                    <div className="col-3 delievery-detail">
                        Delievery by {hours}:{minutes} | Free <del className='cart-detail-font'>{delieveryCost}</del>
                    </div>
                </div>
                <div className="row mx-3 my-2">
                    <div className="col-3 d-flex">
                        {/* <button className='qty-btn' onClick={(e)=>{
                        qty === 1 ? setQty(1)
                        :
                        // setQty(qty-1)
                        setQty(qty-1)
                     
                    } */}
                        <button className='qty-btn' onClick={(e) => {
                            updatecart(qty - 1)
                        }

                        }>-</button>
                        {/* <select className='form-control qty-box' onChange={(e) => { 
                        setQty(JSON.parse(e.target.value)) }} value={qty} > */}
                        <select className='form-control qty-box' onChange={(e) => {
                            updatecart(JSON.parse(e.target.value))
                        }} value={qty} >
                            {qtyArray.map((qty, index) => {
                                return (
                                    <option value={qty} key={index} >{qty}</option>
                                )
                            })}
                        </select>
                        {/* <button className='qty-btn' onClick={(e)=>{
                        qty === 10 ? setQty(qty)
                        :
                        setQty(qty+1)
                       updatecart()
                    }}>+</button> */}
                        <button className='qty-btn' onClick={(e) => {
                            updatecart(qty + 1)
                        }}>+</button>
                    </div>
                    <div className="col-2 remove-btn" onClick={()=>{handleRemove(foodID)}}>
                        Remove
                    </div>
                </div>
                <hr />
            </div>           
        // </div>
        
    )

}

export default CartOrder

// <div>
        //     {name}
        //     {/* {image}, */}
        // {price},
        // {foodID},
        // {quantity},
        // {restaurantID},
        // {detail},
        // {subTotal},
        // {grand_total},
        // </div>