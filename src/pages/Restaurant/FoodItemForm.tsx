import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { BASE_URL, apiList } from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
// import "../../assets/css/registration.css"
import "../../assets/css/fooditemform.css"
import { useUser } from "../../utils/user.context";
import { toast } from "react-toastify";

interface IFoodData {
    name: string,
    category: string,
    // image: string,
    details: string,
    price: string,
    quantity: string,
    userId: string
}

interface IFoodError {
    nameError: string,
    categoryError: string,
    imageError: string,
    detailsError: string,
    priceError: string,
    quantityError: string
}

// const AddFoodItem: React.FC = () => {
const FoodItemForm = () => {
    const [foodData, setFoodData] = useState<IFoodData>({
        name: '',
        category: '',
        // image: '',
        details: '',
        price: '',
        quantity: '',
        userId: ''
    })

    const [errors, setErrors] = useState<IFoodError>({
        nameError: '',
        categoryError: '',
        imageError: '',
        detailsError: '',
        priceError: '',
        quantityError: ''
    })

    const [foodImage, setFoodImage] = useState<File | string>()
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search)
    const foodId = searchParams?.get("fooditem")
    const { token, setIsLoggedIn } = useUser();

    const setFormFields = async (id: string) => {
        if (id !== "") {
            try {
                const editRes = await axios.get(`${BASE_URL + apiList.getfood}/?fooditem=${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const oldData = editRes.data.food[0]
                setFoodData({
                    ...foodData,
                    name: oldData.name,
                    category: oldData.category,
                    // image: '',
                    details: oldData.detail,
                    price: (oldData.price).toString(),
                    quantity: oldData.quantity,
                    userId: ''
                })
                //    setOldImage(BASE_URL+oldData.image)
                setFoodImage(oldData.image)
            }
            catch (err) {
                console.log("error in updating the food item", err);
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
                console.log("cart update error", err);
            }
        }
        else {
            console.log("id is not set");
        }
    }

    useEffect(() => {
        setFormFields(foodId ? foodId : "")
    }, [])


    const navigate = useNavigate();



    const validateForm = () => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if ((foodData.name).trim().length <= 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                nameError: "Please Enter a Valiobjectd Food Name"
            }))
            return 1
        }
        if ((foodData.category).trim().length <= 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                categoryError: "Please Enter a Valid Category"
            }))
            return 1
        }

        if ((foodData.details).trim().length <= 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                detailsError: "Please Enter Valid Details"
            }))
            return 1
        }
        if ((foodData.price).trim().length <= 1 || (foodData.price).trim().length >= 5) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                priceError: "Please Enter a Valid Price"
            }))
            return 1
        }
        if ((foodData.quantity).trim().length < 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                quantityError: "Please Enter Valid Quantity"
            }))
            return 1
        }
    }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let userId = localStorage.getItem("userId")
        if (!userId) {
            userId = ""
        }
        const valid = validateForm()

        if (valid) {
            return
        }
        if (!foodImage) {
            setErrors((prevError) => ({
                ...prevError,
                imageError: "Food Image Is Required"
            }))
            return
        }
        const formData = new FormData();
        formData.append("price", JSON.stringify(foodData.price))
        formData.append("image", foodImage)
        formData.append("category", foodData.category)
        formData.append("details", foodData.details)
        formData.append("name", foodData.name)
        formData.append("restaurantId", userId)
        formData.append("quantity", foodData.quantity)
        foodId !== null && formData.append("foodId", foodId)

        const apiMethod = foodId ? "put" : "post";
        const apiUrl = foodId && foodId !== "" ? BASE_URL + apiList.updatefood : BASE_URL + apiList.addfood;

        try {
            const res = await axios[apiMethod](apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
                navigate("/restaurant/dashboard")
            }
        } catch (error) {
            console.log(foodId ? "Update Food Error" : "Add Food Error", error);
            toast.error(error?.response?.data?.error, {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
            if (error.response.status === 401) {
                toast.error(error?.response?.data?.error, {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = `${e.target.name}Error`
        let { name, value } = e.target;
        if (name === "price") {
            value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        }
        const files = e?.target?.files

        const selected = files as FileList

        if (selected) {
            setFoodImage(selected?.[0])
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: ""
        }))
        setFoodData(prevData => (
            {
                ...prevData,
                [name]: value,
            }))
    }

    return (
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <div className="maindiv w-100 m-auto">
                <div className="container food-form m-5 w-50 d-flex flex-column justify-content-center">
                    <h2 className="d-flex justify-content-center m-2">{foodId ? "Update" : "Add"} Food Item</h2>
                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Food Name:
                        </div>
                        <div className="col-9 d-flex flex-column ">
                            <input type="text"
                                className="form-control"
                                value={foodData.name}
                                name="name"
                                // onChange={(e) => { setFirstname(e.target.value) }} />
                                onChange={handleInputChange} />
                            {
                                errors?.nameError && <div className="error">{errors.nameError}</div>
                            }
                        </div>
                    </div>

                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Food Category:
                        </div>
                        <div className="col-9 d-flex flex-column ">
                            <input type="text"
                                className="form-control"
                                value={foodData.category}
                                name="category"
                                onChange={handleInputChange}
                            />
                            {
                                errors?.categoryError && <div className="error">{errors.categoryError}</div>
                            }
                        </div>
                    </div>
                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Image:
                        </div>
                        <div className="col-9 d-flex z-index-2 position-relative mr-3 flex-column">
                            <input type="file"
                                className="form-control"
                                // value={foodData.image}
                                // onChange={handleFileChange}
                                onChange={handleInputChange}
                                name="image"
                            />
                            {
                                errors?.imageError && <div className="error">{errors.imageError}</div>
                            }
                        </div>
                    </div>
                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Details:
                        </div>
                        <div className="col-9 d-flex flex-column ">
                            <input type="text"
                                className="form-control"
                                value={foodData.details}
                                onChange={handleInputChange}
                                name="details"
                            />
                            {
                                errors?.detailsError && <div className="error">{errors.detailsError}</div>
                            }
                        </div>
                    </div>
                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Price:
                        </div>
                        <div className="col-9 d-flex mr-3 flex-column">
                            <input type="text"
                                className="form-control"
                                value={foodData?.price}
                                onChange={handleInputChange}
                                name="price"
                            />
                            {
                                errors?.priceError && <div className="error">{errors.priceError}</div>
                            }
                        </div>
                    </div>

                    <div className=" row d-flex m-2">
                        <div className="col-3  ">
                            Quantity:
                        </div>
                        <div className="col-9 d-flex flex-column ">
                            <input type="text"
                                className="form-control"
                                value={foodData.quantity}
                                onChange={handleInputChange}
                                name="quantity"
                            />
                            {
                                errors?.quantityError && <div className="error">{errors.quantityError}</div>
                            }
                        </div>
                    </div>


                    <div className=" row d-flex me-2">
                        <div className="col-lg-8 col-md-6 col-sm-4"></div>
                        {
                            foodId ?
                                <div className="col-lg-2 col-md-3  col-sm-4 d-flex justify-content-end">
                                    <input type="submit" value="Update Item" className="btn btn-success" />
                                </div>
                                :
                                <div className="col-lg-2 col-md-3  col-sm-4 d-flex justify-content-end">
                                    <input type="submit" value="Add Item" className="btn btn-success" />
                                </div>
                        }
                        <div className="col-lg-2 col-md-3 col-sm-4  d-flex justify-content-end">
                            <button className="btn btn-dark"
                                onClick={() => {
                                    navigate("/restaurant/dashboard")
                                }}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    )
}

export default FoodItemForm