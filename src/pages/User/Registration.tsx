import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { BASE_URL, apiList } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "../../assets/css/registration.css"
import { useUser } from "../../utils/user.context";
import { toast } from "react-toastify";

interface IRegistrationData {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  confpassword: string,
  phoneno: string,
  city: string,
  pincode: string,
  address: string
}

interface IRegistrationError {
  firstnameError: string,
  lastnameError: string,
  emailError: string,
  passwordError: string,
  confpasswordError: string,
  phonenoError: string,
  cityError: string,
  pincodeError: string,
  addressError: string,
}

const Registration: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoggedIn(isLoggedIn)
      navigate("/dashboard")
    }
  }, [])
  const [registrationData, setRegistrationData] = useState<IRegistrationData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confpassword: '',
    phoneno: '',
    city: '',
    pincode: '',
    address: ''
  })

  const [errors, setErrors] = useState<IRegistrationError>({
    firstnameError: '',
    lastnameError: '',
    emailError: '',
    passwordError: '',
    confpasswordError: '',
    phonenoError: '',
    cityError: '',
    pincodeError: '',
    addressError: '',

  })

  const navigate = useNavigate();


  const validateForm = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if ((registrationData.firstname).trim().length <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstnameError: "Please Enter Valid Firstname"
      }))
      return 1
    }

    if ((registrationData.lastname).trim().length <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastnameError: "Please Enter a Valid Lastname"
      }))
      return 1
    }
    if (!emailRegex.test(registrationData.email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        emailError: "Please Enter a Valid Email Address"
      })
      )
      return 1
    }
    if ((registrationData.phoneno).trim().length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phonenoError: "Please Enter a Valid Phone Number"
      }))
      return 1
    }

    if ((registrationData.password).trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: "Password Is Required"
      }))
      return 1
    }
    if ((registrationData.password).trim().length > 0 && (registrationData.password).trim().length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: "Password Should be atleast 8 Characters"
      }))
      return 1
    }
    if ((registrationData.confpassword).trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confpasswordError: "Confirm Password Is Required"
      }))
      return 1
    }
    if ((registrationData.password).trim() !== (registrationData.confpassword).trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confpasswordError: "Password and Confirm Password must be Same"
      }))
    }
    if ((registrationData.city).trim().length <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cityError: "Please Enter a Valid City Name"
      }))
      return 1
    }
    if ((registrationData.pincode).trim().length < 6 || (registrationData.pincode).trim().length > 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincodeError: "Please Enter a Valid Pincode"
      }))
      return 1
    }
    if ((registrationData.address).trim().length <= 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        addressError: "Please Enter a Valid Address"
      }))
      return 1
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validateForm()

    if (valid) {
      return
    }
    try {
      const res = await axios.post(BASE_URL + apiList.register, registrationData)
      toast.success(res.data, {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
      navigate("/")
    }
    catch (error) {
      console.log("registration Error", error?.response?.data);
      toast.error(error?.response?.data, {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = `${e.target.name}Error`
    let { name, value } = e.target;

    if (name === "phoneno" || name === "pincode") {
      value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: ""
    }))
    setRegistrationData(prevData => (
      {
        ...prevData,
        [name]: value,
      }))
  }

  return (
    <div className="maindiv">
      <div className="registration-box">
        <h2 className="container">Registeration Form</h2>
        <form onSubmit={(e) => { handleSubmit(e) }} >
          <div className="container h-50 d-flex flex-column justify-content-between">

            <div className="row">
              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.firstname}
                    name="firstname"
                    // onChange={(e) => { setFirstname(e.target.value) }} />
                    onChange={handleInputChange} />
                  {
                    errors?.firstnameError && <div className="error">{errors.firstnameError}</div>
                  }

                  <label className="registration-label">Firstname</label>
                </div>
              </div>

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.lastname}
                    name="lastname"
                    onChange={handleInputChange}
                  />
                  {
                    errors?.lastnameError && <div className="error">{errors.lastnameError}</div>
                  }
                  <label className="registration-label">Lastname</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData?.phoneno}
                    onChange={handleInputChange}
                    name="phoneno"
                  />
                  {
                    errors?.phonenoError && <div className="error">{errors.phonenoError}</div>
                  }
                  <label className="registration-label">Phone No:</label>
                </div>
              </div>

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    name="email"
                  />
                  {
                    errors?.emailError && <div className="error">{errors.emailError}</div>
                  }
                  <label className="registration-label"> Email:</label>
                </div>
              </div>
            </div>

            <div className="row">

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="password"
                    value={registrationData.password}
                    onChange={handleInputChange}
                    name="password"
                    autoComplete="new-password"
                  />
                  {
                    errors?.passwordError && <div className="error">{errors.passwordError}</div>
                  }
                  <label className="registration-label"> Password:</label>
                </div>
              </div>

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="password"
                    value={registrationData.confpassword}
                    onChange={handleInputChange}
                    name="confpassword"
                  />
                  {
                    errors?.confpasswordError && <div className="error">{errors.confpasswordError}</div>
                  }
                  <label className="registration-label">Confirm Password:</label>
                </div>
              </div>
            </div>

            <div className="row">

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.city}
                    name="city"
                    onChange={handleInputChange}
                  />
                  {
                    errors?.cityError && <div className="error">{errors.cityError}</div>
                  }
                  <label className="registration-label">City:</label>
                </div></div>

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData?.pincode}
                    onChange={handleInputChange}
                    name="pincode"
                  />
                  {
                    errors?.pincodeError && <div className="error">{errors.pincodeError}</div>
                  }
                  <label className="registration-label">Pin Code:</label>
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-12">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.address}
                    name="address"
                    onChange={handleInputChange}
                  />
                  {
                    errors?.addressError && <div className="error">{errors.addressError}</div>
                  }
                  <label className="registration-label"> Delievery Address:</label>
                </div>
              </div>

            </div>

          </div>
          <input type="submit" value="REGISTER" className="btn btn-primary w-100 radius-25 mt-3" />
          <div className="d-flex justify-content-end me-2 mt-1">
            <div>Already have an account?</div>
            <div className="ms-2 text-primary cursor-pointer"
              onClick={() => {
                navigate("/")
              }}
            >Login</div>
          </div>
        </form>
      </div>
    </div>


    // <form onSubmit={(e) => { handleSubmit(e) }}>
    //   <div className="maindiv w-50 m-auto ">
    //     <div className="container m-5 d-flex flex-column justify-content-center">
    //       <h1 className="mb-5 mx-auto">Restaurant Registeration Form</h1>
    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Restaurant Name:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData.restaurant_name}
    //             name="restaurant_name"
    //             onChange={handleInputChange} />
    //           {
    //             errors?.restaurant_nameError && <div className="error">{errors.restaurant_nameError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Restaurant Category:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <select name="category"
    //             value={registrationData.category}
    //             className="form-control"
    //             onChange={(e) => handleSelect(e)}
    //           >
    //             {
    //               category && category.map((cat) => <option value={cat}>{cat}</option>)
    //             }
    //           </select>
    //           {
    //             errors?.categoryError && <div className="error">{errors.categoryError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Email:
    //         </div>
    //         <div className="col-9 d-flex z-index-2 position-relative mr-3 flex-column">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData.email}
    //             onChange={handleInputChange}
    //             name="email"
    //           />
    //           {
    //             errors?.emailError && <div className="error">{errors.emailError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Password:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <input type="password"
    //             className="form-control"
    //             value={registrationData.password}
    //             onChange={handleInputChange}
    //             name="password"
    //           />
    //           {
    //             errors?.passwordError && <div className="error">{errors.passwordError}</div>
    //           }
    //         </div>
    //       </div>
    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Confirm Password:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <input type="password"
    //             className="form-control"
    //             value={registrationData.confpassword}
    //             onChange={handleInputChange}
    //             name="confpassword"
    //           />
    //           {
    //             errors?.confpasswordError && <div className="error">{errors.confpasswordError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Phone No:
    //         </div>
    //         <div className="col-9 d-flex mr-3 flex-column">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData?.phoneno}
    //             onChange={handleInputChange}
    //             name="phoneno"
    //           />
    //           {
    //             errors?.phonenoError && <div className="error">{errors.phonenoError}</div>
    //           }
    //         </div>
    //       </div>



    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           City:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData.city}
    //             name="city"
    //             onChange={handleInputChange}
    //           />
    //           {
    //             errors?.cityError && <div className="error">{errors.cityError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Pin Code:
    //         </div>
    //         <div className="col-9 d-flex mr-3 flex-column">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData?.pincode}
    //             onChange={handleInputChange}
    //             name="pincode"
    //           />
    //           {
    //             errors?.pincodeError && <div className="error">{errors.pincodeError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Address:
    //         </div>
    //         <div className="col-9 d-flex flex-column ">
    //           <input type="text"
    //             className="form-control"
    //             value={registrationData.address}
    //             name="address"
    //             onChange={handleInputChange}
    //           />
    //           {
    //             errors?.addressError && <div className="error">{errors.addressError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Restaurant Images:
    //         </div>
    //         <div className="col-9 d-flex z-index-2 position-relative mr-3 flex-column">
    //           <input type="file"
    //             className="form-control"
    //             // value={foodData.image}
    //             // onChange={handleFileChange}
    //             onChange={handleMultipleFiles}
    //             name="restaurant_images"
    //             multiple
    //           />
    //           {
    //             errors?.restaurant_imagesError && <div className="error">{errors.restaurant_imagesError}</div>
    //           }
    //         </div>
    //       </div>

    //       <div className=" row d-flex m-2">
    //         <div className="col-3  ">
    //           Menu Image:
    //         </div>
    //         <div className="col-9 d-flex z-index-2 position-relative mr-3 flex-column">
    //           <input type="file"
    //             className="form-control"
    //             // value={foodData.image}
    //             // onChange={handleFileChange}
    //             onChange={handleInputChange}
    //             name="menu_image"
    //           />
    //           {
    //             errors?.menu_imageError && <div className="error">{errors.menu_imageError}</div>
    //           }
    //         </div>
    //       </div>




    //       <div className=" row d-flex me-2">
    //         <div className="col-lg-8 col-md-6 col-sm-4"></div>
    //         <div className="col-lg-2 col-md-3  col-sm-4 d-flex justify-content-end">
    //           <input type="submit" value="Submit" className="btn btn-success" />
    //         </div>
    //         <div className="col-lg-2 col-md-3 col-sm-4  d-flex justify-content-end">
    //           <button className="btn btn-dark"
    //             onClick={() => {
    //               navigate("/restaurant/login")
    //             }}  
    //           >Login</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </form>

  )
}

export default Registration