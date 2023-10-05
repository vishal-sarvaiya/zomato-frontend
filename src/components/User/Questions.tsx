import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../assets/css/questions.css"
import { BASE_URL, apiList } from "../../utils/api";
import { useUser } from "../../utils/user.context";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

interface Option {
    value: string,
    category: string,
    _id: string,
}
interface IQuestions {
    option: Option[],
    question: string,
    _id: string
}
const Questions = () => {
    const [questions, setQuestions] = useState<IQuestions[]>([])
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [result, setResult] = useState<{ id: string; selectedValue: Option; }[]>([]);
    const [modal, setModal] = useState(true)
    const { isLoggedIn } = useUser();
    const fetchQuestions = async () => {
        try {
            const res = await axios.get(BASE_URL + apiList.fetchquestions);
            setQuestions(res.data.data);
        }
        catch (err) {
            console.log("error fetching questions", err);
        }
    }

    const handleSelection = (id: IQuestions["_id"], selectedValue: Option) => {
        setSelectedOption(selectedValue.value)
        const data = {
            id: id,
            selectedValue: selectedValue
        }
        const filetered = result.filter((prev) => {
            return prev.id !== data.id;
        })
        setResult([...filetered, data])
    }

    const handleNext = () => {
        activeQuestion + 1 === questions.length ?
            setActiveQuestion(activeQuestion)
            :
            setActiveQuestion(prev => prev + 1);
    }

    const handlePrev = () => {
        activeQuestion === 0 ?
            setActiveQuestion(activeQuestion)
            :
            setActiveQuestion(prev => prev - 1)
    }

    useEffect(() => {
        fetchQuestions();
    }, [])

    const handleSubmit = async () => {
        if(result.length<questions.length){
            toast.error("Please Answer All The Questions",
            {
                position: "top-right",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            })
            return
        }
        const data = {
            userId: isLoggedIn,
            preferences: result
        }
        try {
            const res = await axios.post(BASE_URL + apiList.cretepreference, data);
            if (res) {
                setModal(false)
            }
        } catch (err) {
            console.log("error", err);
        }
    }
    

    const previousSelected = result.find((r) => {
        if (questions[activeQuestion]._id === r.id) {
            return (r.id)
        }
    })
   
    // setSelectedOption("")
    return (
        <Modal show={modal}
            onHide={() => { setModal(false) }}
            backdrop="static"
            keyboard={false}
            size="xl"
            animation={true}
        >
            <Modal.Header closeButton={true} >
                <Modal.Title className="d-flex">
                    <div className="h3">{activeQuestion + 1}</div>

                    <span style={{ fontWeight: "300" }}>/{questions.length}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="min-70-vh d-flex flex-column justify-content-between">
                {
                    questions && questions?.length > 0 &&
                    <div>
                        <div className="h4">
                        {activeQuestion+1}. {questions[activeQuestion].question.endsWith("?") ? questions[activeQuestion].question : questions[activeQuestion].question + "?"}
                        </div>
                        <div>
                            {

                                questions[activeQuestion].option.map((option) => {
                                    const isSelected = option?.value === selectedOption
                                    return (
                                        <div key={option._id} >
                                            <input type="radio" id={option.value} value={option.value}
                                                name="option"
                                                className="appearance-none"
                                                onChange={(e) => {
                                                    handleSelection(questions[activeQuestion]._id, option)
                                                }}
                                            />
                                            <label htmlFor={option.value}
                                                className={`option-div font-bold ${previousSelected?.selectedValue._id === option._id ? "selected-option" : ""} ${isSelected ? "selected-option" : ""}`}
                                            > {option.value} </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                }
                <div className="d-flex justify-content-between">
                    <button className="btn btn-dark width-10" disabled={activeQuestion === 0}
                        onClick={() => handlePrev()}
                    >Previous</button>
                    {
                        <Button variant="primary" className="width-10" onClick={() => { activeQuestion + 1 !== questions.length ? handleNext() : handleSubmit() }}>
                            {activeQuestion + 1 !== questions.length ? "Next" : "Submit"}
                        </Button>
                    }
                </div>

            </Modal.Body>
        </Modal>
    )
}

export default Questions













//  <div key={index} className={`option-div font-bold ${isSelected ? "selected-option" : ""}`}>
//                                             <input type="radio" id={option.value} value={option.value}
//                                                 name="option"
//                                                 className="appearance-none"
//                                                 onChange={(e) => {
//                                                     handleSelection(questions[activeQuestion]._id, option)
//                                                 }}
//                                             />
//                                             <label htmlFor={option.value} className="ms-2"> {option.value} </label>
//                                         </div>