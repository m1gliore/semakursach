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

const TypesPage = () => {
    const currency = useContext(CurrencyContext)
    const router = useRouter()
    const [modalActive, setModalActive] = useState(false)
    const [currentWindow, setCurrentWindow] = useState(null)
    const {register, handleSubmit} = useForm()
    const [user,] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [types, setTypes] = useState([])

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
    }, [])

    const reloadPage = () => {
        router.reload()
    }

    const handleAdd = (data) => {
        const requestBody = {
            name: data.nameAdd
        }
        axios.post('http://localhost:8080/type/save', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleEdit = async (data) => {
        const requestBody = {
            id: data.typeEdit,
            name: data.nameEdit
        }
        axios.put('http://localhost:8080/type/upd', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleDelete = async (data) => {
        axios.delete(`http://localhost:8080/type/del?id=${data.typeDelete}`)
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
            {types.map((type, index) => (
                <StyledGamesPage.GameCard key={index}>
                    <StyledGamesPage.GameName>{type.name}</StyledGamesPage.GameName>
                </StyledGamesPage.GameCard>
            ))}
            <ModalWindow active={modalActive} setActive={setModalActive}>
                <ModalForm.Form onSubmit={handleSubmit(handleAdd)}
                                style={{display: currentWindow === "add" ? "flex" : "none"}}>
                    <ModalForm.Title>Добавить тип</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="text" {...register("nameAdd")}
                                                 placeholder="Наименование типа"/>
                            <ModalForm.FormButton>Добавить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleEdit)}
                                style={{display: currentWindow === "edit" ? "flex" : "none"}}>
                    <ModalForm.Title>Изменить тип</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
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
                            <ModalForm.FormInput required type="text" {...register("nameEdit")}
                                                 placeholder="Наименование типа"/>
                            <ModalForm.FormButton>Изменить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleDelete)}
                                style={{display: currentWindow === "delete" ? "flex" : "none"}}>
                    <ModalForm.Title>Удалить тип</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("typeDelete")} style={{
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
                            <ModalForm.FormButton>Удалить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
            </ModalWindow>
        </StyledGamesPage.GameListContainer>
    )
}

export default TypesPage
