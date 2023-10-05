import React from 'react'

const Unauthorised = () => {
  return (
      <div className='nodata-div d-flex flex-column justify-content-center align-items-center'>
        <div className='font-400'>
          <i className="fa fa-exclamation-triangle zomato-color" aria-hidden="true"></i>
        </div>
        {/* <div className='font-400'>Access Denied</div> */}
        <div className='fs-3'>You Don't Have Access To This Page !</div>
      </div>
  )
}

export default Unauthorised