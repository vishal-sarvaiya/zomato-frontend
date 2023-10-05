import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { BASE_URL, apiList } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "../../assets/css/registration.css"
import { useUser } from "../../utils/user.context";
import { toast } from "react-toastify";

interface IRegistrationData {
  restaurant_name: string,
  email: string,
  password: string,
  confpassword: string,
  phoneno: string,
  city: string,
  pincode: string,
  address: string,
  category: string,
}

interface IRegistrationError {
  restaurant_nameError: string,
  emailError: string,
  passwordError: string,
  confpasswordError: string,
  phonenoError: string
  restaurant_imagesError: string,
  menu_imageError: string,
  cityError: string,
  pincodeError: string
  addressError: string,
  categoryError: String,
}

const RestaurantRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useUser()
  let category = ["Pizza", "South Indian", "Punjabi", "Italian", "Desserts", "Gujarati", "Chinese", "Mexican", "Burger"]

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoggedIn(isLoggedIn)
      setIsLoggedIn(isLoggedIn)
      navigate("/restaurant/dashboard")
    }
  }, [])

  const [registrationData, setRegistrationData] = useState<IRegistrationData>({
    restaurant_name: '',
    email: '',
    password: '',
    confpassword: '',
    phoneno: '',
    city: '',
    pincode: '',
    address: '',
    category: '',
  })
  const [restaurantImages, setRestaurantImages] = useState<File[]>([]);
  const [menuImage, setMenuImage] = useState<File>()

  const [errors, setErrors] = useState<IRegistrationError>({
    restaurant_nameError: '',
    emailError: '',
    passwordError: '',
    confpasswordError: '',
    phonenoError: '',
    restaurant_imagesError: '',
    cityError: '',
    pincodeError: '',
    addressError: '',
    menu_imageError: '',
    categoryError: '',
  })


  const validateForm = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if ((registrationData.restaurant_name).trim().length <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        restaurant_nameError: "Please Enter a Valid Restaurant Name"
      }))
      return 1
    }
    if ((registrationData.category).trim().length <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryError: "Please Enter a Valid Category"
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
    if ((registrationData?.phoneno).trim().length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phonenoError: "Please Enter a Valid Phone Number"
      }))
      return 1
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

    if (!restaurantImages || restaurantImages.length < 4) {
      setErrors((prevError) => ({
        ...prevError,
        restaurant_imagesError: "Minimum 4 Restaurant Images Is Required"
      }))
      return
    }
    if (restaurantImages.length > 4) {
      setErrors((prevError) => ({
        ...prevError,
        restaurant_imagesError: "Maximum 4 Restaurant Images Is allowed"
      }))
      return
    }

    if (!menuImage) {
      setErrors((prevError) => ({
        ...prevError,
        menu_imageError: "Menu Image Is Required"
      }))
      return
    }



    const formData = new FormData();
    formData.append("restaurant_name", registrationData.restaurant_name)
    formData.append("email", registrationData.email)
    formData.append("password", registrationData.password)
    formData.append("phoneno", JSON.stringify(registrationData.phoneno))
    formData.append("menu_image", menuImage)
    formData.append("city", registrationData.city)
    formData.append("pincode", JSON.stringify(registrationData.pincode))
    formData.append("address", registrationData.address)
    formData.append("category", registrationData.category)
    for (const image of restaurantImages) {
      formData.append("restaurant_images", image);
    }

    try {
      const res = await axios.post(BASE_URL + apiList.restaurantregister, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      toast.success(res.data, {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
      navigate("/restaurant/login")
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

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    const selected = files as FileList

    setErrors((prevError) => ({
      ...prevError,
      restaurant_imagesError: ""
    }))

    if (selected) {
      const selectedImages: File[] = [];
      for (let i of selected) {
        // restaurantImages.push(i)
        selectedImages.push(i);
      }
      setRestaurantImages(selectedImages);
    }
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldName = `${e.target.name}Error`
    let { name, value } = e.target;
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = `${e.target.name}Error`
    let { name, value } = e.target;
    if (name === "pincode" || name === "phoneno") {
      value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    }

    const files = e?.target?.files;
    const selected = files as FileList

    if (selected?.[0]) {
      setMenuImage(selected[0])
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
        <h2 className="container">Restaurant Registeration Form</h2>
        <form onSubmit={(e) => { handleSubmit(e) }} >
          <div className="container h-50 d-flex flex-column justify-content-between">

            <div className="row">
              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="text"
                    value={registrationData.restaurant_name}
                    name="restaurant_name"
                    onChange={handleInputChange} />
                  {
                    errors?.restaurant_nameError && <div className="error">{errors.restaurant_nameError}</div>
                  }

                  <label className="registration-label"> Restaurant Name:</label>
                </div>
              </div>

              <div className="col-6">
                <div className="user-box mt-3 row align-items-center justify-content-start w-100">
                  <div className="col-3">Category: </div>
                  <select name="category"
                    className="form-control w-50"
                    value={registrationData.category}
                    onChange={(e) => handleSelect(e)}
                  >
                    <option style={{ display: "none" }} label="Select Restaurant Category"></option>
                    {
                      category && category.map((cat) =>
                        <option value={cat}>{cat}</option>)
                    }
                  </select>
                  {
                    errors?.categoryError && <div className="error">{errors.categoryError}</div>
                  }
                  {/* <label className="registration-label">Restaurant Category:</label> */}
                </div>
              </div>
            </div>

            <div className="row">
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

              <div className="col-6">
                <div className="user-box mt-3">
                  <input type="password"
                    value={registrationData.password}
                    autoComplete="new-password"
                    onChange={handleInputChange}
                    name="password"
                  />
                  {
                    errors?.passwordError && <div className="error">{errors.passwordError}</div>
                  }
                  <label className="registration-label">Password:</label>
                </div>
              </div>
            </div>

            <div className="row">

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
                  <label className="registration-label">  Confirm Password:</label>
                </div>
              </div>

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
                  <label className="registration-label">Address:</label>
                </div>
              </div>

            </div>

            <div className="row">

              <div className="col-6 d-flex align-items-center justify-content-between">
                <div className=""> Restaurant Images:</div>
                <div className="user-boxa mt-3">
                  <input type="file"
                    className="custom-file-upload"
                    // value={foodData.image}
                    // onChange={handleFileChange}
                    onChange={handleMultipleFiles}
                    name="restaurant_images"
                    multiple
                  />
                  {
                    errors?.restaurant_imagesError && <div className="error">{errors.restaurant_imagesError}</div>
                  }

                </div>
              </div>

              <div className="col-6 d-flex align-items-center justify-content-between">
                <div className=""> Menu Image:</div>
                <div className="user-boxa mt-3">
                  <input type="file"
                    className="custom-file-upload"
                    // value={foodData.image}
                    // onChange={handleFileChange}
                    onChange={handleInputChange}
                    name="menu_image"
                  />
                  {
                    errors?.menu_imageError && <div className="error">{errors.menu_imageError}</div>
                  }
                </div>
              </div>

            </div>

          </div>
          <input type="submit" value="REGISTER" className="btn btn-primary w-100 radius-25 mt-3" />
          <div className="d-flex justify-content-end me-2 mt-1">
            <div>Already have an account?</div>
            <div className="ms-2 text-primary cursor-pointer"
              onClick={() => {
                navigate("/restaurant/login")
              }}
            >Login</div>
          </div>
        </form>
      </div>
    </div>

  )
}

export default RestaurantRegistration