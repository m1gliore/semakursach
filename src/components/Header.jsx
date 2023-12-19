import styled from "styled-components";
import {
    AttachMoney,
    CurrencyExchangeOutlined,
    CurrencyRuble,
    Download,
    Euro,
    KeyboardArrowDown,
    Search,
    ShoppingCartOutlined
} from "@mui/icons-material";
import {Badge, Option, Select, selectClasses} from "@mui/joy";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as ModalForm from "./ModalForm";
import ModalWindow from "./ModalWindow";
import {useLocalStorage} from "react-use";
import axios from "axios";

const Wrapper = styled.div`
  width: 100%;
`

const Container = styled.div`
  width: calc(100% - 4vw);
  padding: 1vw 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Logo = styled.h1`
  width: 6vw;
  height: 3vw;
  cursor: pointer;
  margin: 0;

  &:hover {
    opacity: .7;
  }
`

const Center = styled.div`
  flex: ${props => props.admin ? 2 : 1};
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`

const Item = styled.span`
  text-transform: uppercase;
  opacity: .7;
  cursor: pointer;

  &:hover {
    opacity: .4;
  }
`

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
`

const BadgeContainer = styled(Badge)`
  opacity: .9;
  cursor: pointer;

  &:hover {
    opacity: .6;
  }
`

const Header = ({handleCurrencyChange}) => {
    let admin = JSON.parse(localStorage.getItem("user"))
    const router = useRouter()
    const {quantity} = useSelector((state) => state.cart)
    const [modalActive, setModalActive] = useState(false)
    const [currentWindow, setCurrentWindow] = useState(null)
    const {register, handleSubmit} = useForm()
    const [user, setUser] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [, setUsername] = useLocalStorage("username", "")
    const [idUser, setIdUser] = useLocalStorage("idUser", 0)

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

    const reloadPage = () => {
        router.reload()
    }

    const handleChange = (event, newValue) => {
        handleCurrencyChange(newValue)
    }

    const handleLogin = (data) => {
        const username = data.usernameLogin
        const password = data.passwordLogin
        axios.get(`http://localhost:8080/auth/login?username=${username}&password=${password}`)
            .then(res => {
                setUser(res.data.role)
                setUsername(res.data.username)
                setIdUser(res.data.id)
                reloadPage()
            })
        setModalActive(false)
    }

    const handleReg = (data) => {
        if (data.passwordReg === data.repPasswordReg) {
            const requestBody = {
                username: data.usernameReg,
                password: data.passwordReg
            }
            axios.post('http://localhost:8080/auth/signup', requestBody)
                .then(() => setCurrentWindow("confirm"))
        } else {
            alert("Пароли не совпадают")
        }
    }

    const handleRegConfirm = async (data) => {
        await axios.post(`http://localhost:8080/auth/signup/confirm?code=${data.code}`)
            .then(() => setModalActive(false))
    }

    const handlePayment = async (data) => {
        const requestBody = {
            countOfMoney: data.payment,
            person: {
                id: idUser
            }
        }
        await axios.post('http://localhost:8080/paym/upd', requestBody)
            .then(() => reloadPage())
    }

    return (<Wrapper>
            <Container>
                <Left>
                    <Logo onClick={() => router.push("/")}>Главная</Logo>
                </Left>
                <Center admin={isAdmin}>
                    {user !== "" &&
                        <Item onClick={() => router.push("/components")}>Компоненты</Item>
                    }
                    {user !== "" && isAdmin &&
                        <Item onClick={() => router.push("/types")}>Типы</Item>
                    }
                    {user !== "" && isAdmin &&
                        <Item onClick={() => router.push("/fabricators")}>Производители</Item>
                    }
                    {isAdmin && <>
                        <Item onClick={() => router.push("/adminPanel")}>Панель управления</Item>
                    </>}
                    {user !== "" &&
                        <Item onClick={() => router.push("/reviews")}>Отзывы</Item>
                    }
                    {user === "" && <Item onClick={() => {
                        setCurrentWindow("login")
                        setModalActive(true)
                    }}>Вход</Item>}
                    {user === "" && <Item onClick={() => {
                        setCurrentWindow("reg")
                        setModalActive(true)
                    }}>Регистрация</Item>}
                    {user !== "" && <Item onClick={() => {
                        setUser("")
                        setUsername("")
                        router.push("/")
                            .then(() => reloadPage())
                    }}>Выйти</Item>}
                </Center>
                <Right>
                    {user !== "" &&
                        <Select defaultValue="RUB" indicator={<KeyboardArrowDown/>} sx={{
                            width: 150, [`& .${selectClasses.indicator}`]: {
                                transition: ".4s ease-out", [`&.${selectClasses.expanded}`]: {
                                    transform: "rotate(-180deg)",
                                },
                            },
                        }} onChange={handleChange}>
                            <Option value="RUB"><CurrencyRuble/>&nbsp;Рубль</Option>
                            <Option value="USD"><AttachMoney/>&nbsp;Доллар</Option>
                            <Option value="EUR"><Euro/>&nbsp;Евро</Option>
                        </Select>
                    }
                    {user !== "" && !isAdmin &&
                    <CurrencyExchangeOutlined onClick={() => {
                        setCurrentWindow("payment")
                        setModalActive(true)
                    }}
                    style={{cursor: "pointer"}}/>
                    }
                    {user !== "" && isAdmin &&
                        <Item onClick={() => router.push("/sales")}>Скидки</Item>
                    }
                </Right>
            </Container>
            <ModalWindow active={modalActive} setActive={setModalActive}>
                <ModalForm.Form onSubmit={handleSubmit(handleLogin)}
                                style={{display: currentWindow !== "login" && "none"}}>
                    <ModalForm.Title>Вход</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="email" {...register("usernameLogin")}
                                                 placeholder="E-mail"/>
                            <ModalForm.FormInput required type="password" {...register("passwordLogin")}
                                                 placeholder="Пароль"/>
                            <ModalForm.FormButton>Войти</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleReg)}
                                style={{display: currentWindow !== "reg" && "none"}}>
                    <ModalForm.Title>Регистрация</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="email" {...register("usernameReg")}
                                                 placeholder="E-mail"/>
                            <ModalForm.FormInput required type="password" {...register("passwordReg")}
                                                 placeholder="Пароль"/>
                            <ModalForm.FormInput required type="password" {...register("repPasswordReg")}
                                                 placeholder="Повторите пароль"/>
                            <ModalForm.FormButton>Зарегистрироваться</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handleRegConfirm)}
                                style={{display: currentWindow !== "confirm" && "none"}}>
                    <ModalForm.Title>Введите код из почты</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="number" {...register("code")}
                                                 placeholder="Введите код"/>
                            <ModalForm.FormButton>Подтвердить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
                <ModalForm.Form onSubmit={handleSubmit(handlePayment)}
                                style={{display: currentWindow !== "payment" && "none"}}>
                    <ModalForm.Title>Пополненте баланса</ModalForm.Title>
                    <ModalForm.MainContainer>
                        <ModalForm.RightFormContainer>
                            <ModalForm.FormInput required type="number" {...register("payment")}
                                                 placeholder="Введите сумму"/>
                            <ModalForm.FormButton>Подтвердить</ModalForm.FormButton>
                        </ModalForm.RightFormContainer>
                    </ModalForm.MainContainer>
                </ModalForm.Form>
            </ModalWindow>
        </Wrapper>)
}

export default Header
