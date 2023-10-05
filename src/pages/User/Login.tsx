import axios from "axios";
import React, { FormEvent, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, apiList } from "../../utils/api";
import { useUser } from "../../utils/user.context";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import "../../assets/css/login.css"

interface ILoginError {
    emailError: string,
    passwordError: string,
}


export const loginContext = createContext<boolean>(localStorage.getItem("userId") ? true : false)
// const Login:React.FC<NavbarProps> = ({setLoginFunc}) => {
const Login: React.FC = () => {
    const navigate = useNavigate()
    const { isLoggedIn, setIsLoggedIn, setRole, setToken, setUserName } = useUser()


    useEffect(() => {
        if (isLoggedIn) {
            setIsLoggedIn(isLoggedIn)
            navigate("/dashboard")
        }
    }, [])
    const [errors, setErrors] = useState<ILoginError>({
        emailError: '',
        passwordError: '',
    })

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!emailRegex.test(email)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                emailError: "Please Enter Valid Email Address"
            }))
            return
        }
        if (!password || password.length < 8) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordError: "Password Should be atleast 8 characters long"
            }))
            return
        }

        const data = {
            email: email,
            password: password
        }
        try {
            const res = await axios.post(BASE_URL + apiList.login, data)
            const decodedToken: any = jwtDecode(res.data.token);
            if (res?.data?.token) {
                localStorage.setItem("userId", decodedToken?.userId)
                localStorage.setItem("firstTimeLogin", JSON.stringify(res.data.data.preference.length === 0))
                localStorage.setItem("token", res.data.token)
                setIsLoggedIn(decodedToken?.userId)
                setToken(res.data.token)
                setRole(decodedToken?.role)
                setUserName(decodedToken?.name)


                toast.success("login successfully", {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
            }
            navigate("/homepage")
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Login Error", error.response?.data);
                toast.error(error?.response?.data, {
                    position: "top-right",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                })
            }
            else {
                console.log("Login Error", error);
            }

        }
    }

    return (
        <div className="maindiv">
            <div className="login-box">
                <h2 className="mt-2 text-center">Login</h2>
                <form onSubmit={(e) => { handleSubmit(e) }} >
                    <div className="container h-50 d-flex flex-column justify-content-between">
                        <div className="user-box mt-3">
                            <input type="text"
                                value={email}
                                onChange={(e) => {
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        emailError: ''
                                    }))
                                    setEmail(e.target.value)
                                }
                                }
                            />
                            {
                                errors?.emailError &&
                                <div className="error font-14px">{errors.emailError} </div>
                            }
                            <label className="login-label">Email</label>
                        </div>
                        <div className="user-box mt-3">
                            <input type="password"
                                value={password}
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        passwordError: ""
                                    }))
                                    setPassword(e.target.value)
                                }}
                            />
                            {
                                errors.passwordError &&
                                <div className="error  font-14px">{errors.passwordError} </div>
                            }
                            <label className="login-label">Password</label>
                        </div>
                    </div>
                    <input type="submit" value="LOGIN" className="btn btn-primary w-100 radius-25 mt-3" />
                    <div className="d-flex justify-content-end me-2 mt-1">
                        <div>Don't have an account?</div>
                        <div className="ms-2 text-primary cursor-pointer"
                            onClick={() => {
                                navigate("/register")
                            }}
                        >Register</div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login