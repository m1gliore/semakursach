import * as StyledGamesPage from "../../components/StyledGamesPage";
import {convertCurrency} from "../../lib/Currency";
import React, {useContext, useEffect, useState} from "react";
import CurrencyContext from "../../context/CurrencyContext";
import {useRouter} from "next/router";
import {AddIcon} from "../../components/StyledGamesPage";
import * as ModalForm from "../../components/ModalForm";
import {Download} from "@mui/icons-material";
import {useForm} from "react-hook-form";
import {fileHandler} from "../../lib/Game";
import ModalWindow from "../../components/ModalWindow";
import {useLocalStorage} from "react-use";
import axios from "axios";

const ComponentsPage = () => {
    const currency = useContext(CurrencyContext)
    const router = useRouter()
    const [modalActive, setModalActive] = useState(false)
    const [currentWindow, setCurrentWindow] = useState(null)
    const {register, handleSubmit} = useForm()
    const [user,] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [types, setTypes] = useState([])
    const [fabricators, setFabricators] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [total, setTotal] = useState(0)
    const [amountOfComp, setAmountOfComp] = useState(0)
    const [idUser,] = useLocalStorage("idUser", 0)

    useEffect(() => {
        if (user !== "") {
            switch (user) {
                case "ROLE_ADMIN":
                    setIsAdmin(true)
                    break
                case "ROLE_USER":
                    setIsAdmin(false)
                    break
                default:
                    break
            }
        }
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8080/type/getAll')
            .then(res => setTypes(res.data))
        axios.get('http://localhost:8080/fabr/getAll')
            .then(res => setFabricators(res.data))
        axios.get('http://localhost:8080/comp/getAll')
            .then(res => setComponents(res.data))
    }, [])

    const reloadPage = () => {
        router.reload()
    }

    const [components, setComponents] = useState([])

    const handleAdd = (data) => {
        const requestBody = {
            name: data.nameAdd,
            price: data.priceAdd,
            amount: data.amountAdd,
            fabricator: {
                id: data.fabricatorAdd
            },
            type: {
                id: data.typeAdd
            }

        }
        axios.post('http://localhost:8080/comp/save', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleOrder = async (data) => {
        setAmountOfComp(data.amountOrder)
        const requestBody = {
            amount: data.amountOrder,
            component: {
                id: currentId
            }

        }
        await axios.post('http://localhost:8080/order/regOrder', requestBody)
            .then((res) => {
                setTotal(res.data.totalPrice)
                setCurrentWindow("orderSubmit")
            })
    }

    const handleOrderSubmit = async () => {
        const requestBody = {
            amount: Number(amountOfComp),
            component: {
                id: currentId
            },
            person: {
              id: idUser
            },
            totalPrice: total
        }
        await axios.post('http://localhost:8080/order/submit', requestBody)
            .then(() => {
                setModalActive(false)
                reloadPage()
            })
    }

    const handleEdit = async (data) => {
        const requestBody = {
            id: data.componentEdit,
            name: data.nameEdit,
            price: data.priceEdit,
            amount: data.amountEdit,
            fabricator: {
                id: data.fabricatorEdit
            },
            type: {
                id: data.typeEdit
            }

        }
        axios.put('http://localhost:8080/comp/upd', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleDelete = async (data) => {
        axios.delete(`http://localhost:8080/comp/del?id=${data.componentDelete}`)
            .then(() => reloadPage())
        setModalActive(false)
    }

    return (
        <StyledGamesPage.GameListContainer>
            {isAdmin &&
                <StyledGamesPage.AddIcon fontSize="large" onClick={() => {
                    setCurrentWindow("add")
                    setModalActive(true)
                }}/>
            }
            {isAdmin &&
                <StyledGamesPage.EditIcon fontSize="large" onClick={() => {
                    setCurrentWindow("edit")
                    setModalActive(true)
                }}/>
            }
            {isAdmin &&
                <StyledGamesPage.DeleteIcon fontSize="large" onClick={() => {
                    setCurrentWindow("delete")
                    setModalActive(true)
                }}/>
            }
            {components.map((component, index) => (
                <StyledGamesPage.GameCard key={index} onClick={() => {
                    if (!isAdmin) {
                        setCurrentId(component.id)
                        setCurrentWindow("order")
                        setModalActive(true)
                    }
                }}>
                    <StyledGamesPage.GameName>{component.name}</StyledGamesPage.GameName>
                    <StyledGamesPage.GamePrice>{convertCurrency(currency, component.price)}</StyledGamesPage.GamePrice>
                    <StyledGamesPage.GamePrice>Количество: {component.amount}</StyledGamesPage.GamePrice>
                </StyledGamesPage.GameCard>
            ))}
            <ModalWindow active={modalActive} setActive={setModalActive}>
                <ModalForm.Form onSubmit={handleSubmit(handleAdd)} style={{display: currentWindow === "add" ? "flex" : "none"}}>
                    <ModalForm.Title>Добавить компонент</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="text" {...register("nameAdd")}
                                                 placeholder="Наименование компонента"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("priceAdd")}
                                                 placeholder="Цена"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("amountAdd")}
                                                 placeholder="Количество"/>
                            <select {...register("typeAdd")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Тип</option>
                                {types.map((type, index) => (
                                    <option key={index} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            <select {...register("fabricatorAdd")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                < option> Производитель< /option>
                                {fabricators.map((fabricator, index) => (
                                    <option key={index} value={fabricator.id}>{fabricator.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormButton>Добавить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleOrder)} style={{display: currentWindow === "order" ? "flex" : "none"}}>
                    <ModalForm.Title>Заказать компонент</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="number" min="0" {...register("amountOrder")}
                                                 placeholder="Количество"/>
                            <ModalForm.FormButton>Заказать</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleOrderSubmit)} style={{display: currentWindow === "orderSubmit" ? "flex" : "none"}}>
                    <ModalForm.Title>Подтвердить заказ</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.Title>Сумма: {total}</ModalForm.Title>
                            <ModalForm.FormButton>Подтвердить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleEdit)} style={{display: currentWindow === "edit" ? "flex" : "none"}}>
                    <ModalForm.Title>Изменить компонент</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("componentEdit")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Компонент</option>
                                {components.map((component, index) => (
                                    <option key={index} value={component.id}>{component.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormInput required type="text" {...register("nameEdit")}
                                                 placeholder="Наименование компонента"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("priceEdit")}
                                                 placeholder="Цена"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("amountEdit")}
                                                 placeholder="Количество"/>
                            <select {...register("typeEdit")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Тип</option>
                                {types.map((type, index) => (
                                    <option key={index} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            <select {...register("fabricatorEdit")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                < option> Производитель< /option>
                                {fabricators.map((fabricator, index) => (
                                    <option key={index} value={fabricator.id}>{fabricator.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormButton>Изменить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleDelete)} style={{display: currentWindow === "delete" ? "flex" : "none"}}>
                    <ModalForm.Title>Удалить компонент</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("componentDelete")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Компонент</option>
                                {components.map((component, index) => (
                                    <option key={index} value={component.id}>{component.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormButton>Удалить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
            </ModalWindow>
        </StyledGamesPage.GameListContainer>
    )
}

export default ComponentsPage
