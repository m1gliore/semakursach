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

const FabricatorsPage = () => {
    const currency = useContext(CurrencyContext)
    const router = useRouter()
    const [modalActive, setModalActive] = useState(false)
    const [currentWindow, setCurrentWindow] = useState(null)
    const {register, handleSubmit} = useForm()
    const [user,] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [fabricators, setFabricators] = useState([])

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
        axios.get('http://localhost:8080/fabr/getAll')
            .then(res => setFabricators(res.data))
    }, [])

    const reloadPage = () => {
        router.reload()
    }

    const handleAdd = (data) => {
        const requestBody = {
            name: data.nameAdd
        }
        axios.post('http://localhost:8080/fabr/save', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleEdit = async (data) => {
        const requestBody = {
            id: data.fabricatorEdit,
            name: data.nameEdit
        }
        axios.put('http://localhost:8080/fabr/upd', requestBody)
            .then(() => reloadPage())
        setModalActive(false)
    }

    const handleDelete = async (data) => {
        axios.delete(`http://localhost:8080/fabr/del?id=${data.fabricatorDelete}`)
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
            {fabricators.map((fabricator, index) => (
                <StyledGamesPage.GameCard key={index}>
                    <StyledGamesPage.GameName>{fabricator.name}</StyledGamesPage.GameName>
                </StyledGamesPage.GameCard>
            ))}
            <ModalWindow active={modalActive} setActive={setModalActive}>
                <ModalForm.Form onSubmit={handleSubmit(handleAdd)}
                                style={{display: currentWindow === "add" ? "flex" : "none"}}>
                    <ModalForm.Title>Добавить производителя</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="text" {...register("nameAdd")}
                                                 placeholder="Наименование производителя"/>
                            <ModalForm.FormButton>Добавить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleEdit)}
                                style={{display: currentWindow === "edit" ? "flex" : "none"}}>
                    <ModalForm.Title>Изменить производителя</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("fabricatorEdit")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Производитель</option>
                                {fabricators.map((fabricator, index) => (
                                    <option key={index} value={fabricator.id}>{fabricator.name}</option>
                                ))}
                            </select>
                            <ModalForm.FormInput required type="text" {...register("nameEdit")}
                                                 placeholder="Наименование производителя"/>
                            <ModalForm.FormButton>Изменить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleDelete)}
                                style={{display: currentWindow === "delete" ? "flex" : "none"}}>
                    <ModalForm.Title>Удалить производителя</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.LeftFormContainer></ModalForm.LeftFormContainer>
                        <ModalForm.RightFormContainer>
                            <select {...register("fabricatorDelete")} style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid gray",
                                borderRadius: "5px"
                            }}>
                                <option>Производитель</option>
                                {fabricators.map((fabricator, index) => (
                                    <option key={index} value={fabricator.id}>{fabricator.name}</option>
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

export default FabricatorsPage
