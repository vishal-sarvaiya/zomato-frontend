import React from 'react'
import { BASE_URL } from '../../utils/api'
import "../../assets/css/dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

interface RestaurantData {
    restaurant_name: string,
    restaurant_images: string[],
    _id: string,
    address: string
}
interface ProductProps {
    restaurant: RestaurantData;
}
const Product: React.FC<ProductProps> = ({ restaurant }) => {
        return (
        <div className="col-3 px-3 py-2 m-1 d-flex flex-column rounded-4 width-30 foodBox" >
            <Link to={`productpage?restaurant=${restaurant._id}`} className='link-div'>
                <div className='d-flex justify-content-center'>
                    <img className='rounded-4 m-1' alt='' src={BASE_URL + restaurant.restaurant_images[0]} height='250' width='340' />
                </div>
                <div className='d-flex justify-content-between'>
                    <div>{restaurant.restaurant_name.toUpperCase()}</div>

                    <div className='rating d-flex justify-content-between px-1'>
                        <div>4.5</div>
                        <div>
                            <FontAwesomeIcon icon={faStar} style={{ width: '13px', height: '15px' }} />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='description'>{restaurant.address.slice(0, 23) + "..."}</div>
                    <div className='description'>{200 + " for one"}</div>
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
}

export default Product