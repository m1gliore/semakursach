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

const SalesPage = () => {
    const currency = useContext(CurrencyContext)
    const router = useRouter()
    const [modalActive, setModalActive] = useState(false)
    const [currentWindow, setCurrentWindow] = useState(null)
    const {register, handleSubmit} = useForm()
    const [user,] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [sales, setSales] = useState([])

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
        axios.get('http://localhost:8080/wholesale/getAll')
            .then(res => setSales(res.data))
        axios.get('http://localhost:8080/comp/getAll')
            .then(res => setComponents(res.data))
    }, [])

    const reloadPage = () => {
        router.reload()
    }

    const [components, setComponents] = useState([])

    const handleAdd = (data) => {
        const requestBody = {
            component: {
                id: data.componentAdd
            },
            beginningWith: data.beginningWithAdd,
            coefficient: data.coefficientAdd
        }
        axios.post('http://localhost:8080/wholesale/save', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleEdit = async (data) => {
        const requestBody = {
            id: data.saleEdit,
            component: {
                id: data.componentEdit
            },
            beginningWith: data.beginningWithEdit,
            coefficient: data.coefficientEdit
        }
        axios.put('http://localhost:8080/wholesale/upd', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleDelete = async (data) => {
        axios.delete(`http://localhost:8080/wholesale/del?id=${data.saleDelete}`)
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
            {sales.map((sale, index) => (
                <StyledGamesPage.GameCard key={index}>
                    <StyledGamesPage.GameName>Акция на: {sale.component.name}</StyledGamesPage.GameName>
                    <StyledGamesPage.GamePrice>От: {sale.beginningWith} штук</StyledGamesPage.GamePrice>
                    <StyledGamesPage.GamePrice>Скидка: {sale.coefficient * 100}%</StyledGamesPage.GamePrice>
                </StyledGamesPage.GameCard>
            ))}
            <ModalWindow active={modalActive} setActive={setModalActive}>
                <ModalForm.Form onSubmit={handleSubmit(handleAdd)}
                                style={{display: currentWindow === "add" ? "flex" : "none"}}>
                    <ModalForm.Title>Добавить скидку</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="number" step="0.01" min="0" max="1" {...register("coefficientAdd")}
                                                 placeholder="Коэффициент"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("beginningWithAdd")}
                                                 placeholder="Количество"/>
                            <select {...register("componentAdd")} style={{
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
                            <ModalForm.FormButton>Добавить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleEdit)}
                                style={{display: currentWindow === "edit" ? "flex" : "none"}}>
                    <ModalForm.Title>Изменить скидку</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("saleEdit")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Акция</option>
                                {sales.map((sale, index) => (
                                    <option key={index} value={sale.id}>{sale.component.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormInput required type="number" step="0.01" min="0" max="1" {...register("coefficientEdit")}
                                                 placeholder="Коэффициент"/>
                            <ModalForm.FormInput required type="number" min="0" {...register("beginningWithEdit")}
                                                 placeholder="Количество"/>
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
                            <ModalForm.FormButton>Изменить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleDelete)}
                                style={{display: currentWindow === "delete" ? "flex" : "none"}}>
                    <ModalForm.Title>Удалить скидку</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("saleDelete")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Акция</option>
                                {sales.map((sale, index) => (
                                    <option key={index} value={sale.id}>{sale.component.name}</option>
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

export default SalesPage
