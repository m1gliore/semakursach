import {useRouter} from "next/router";
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    Box, AppBar, Toolbar, Typography, IconButton, Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from '@mui/material';
import {BarChart, PieChart, ShowChart} from '@mui/icons-material';
import {Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie} from 'recharts';
import axios from "axios";

const MenuBar = styled(Toolbar)`
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
`

const Content = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`

const Title = styled.h1``

const AdminPanel = () => {
    const admin = true
    const router = useRouter()
    const [selectedMenu, setSelectedMenu] = useState('profitAll')
    const [stat1, setStat1] = useState([])
    const [stat2, setStat2] = useState([])

    useEffect(() => {
        (async () => {
            await axios.get('http://localhost:8080/graph/people')
                .then(res => setStat1(res.data))
            await axios.get('http://localhost:8080/graph/orders')
                .then(res => {
                    const sortedData = res.data.sort((a, b) => b.totalPrice - a.totalPrice);
                    setStat2(sortedData);
                });
        })()
    }, [])

    const handleDownloadOrdersExcel = async () => {
        await axios.get('http://localhost:8080/report/orders', {responseType: 'arraybuffer'})
            .then(res => {
                const blob = new Blob([res.data], {type: 'application/octet-stream'});
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'orders.xlsx';
                link.click();
            });
    }

    const handleDownloadPeopleExcel = async () => {
        await axios.get('http://localhost:8080/report/people', {responseType: 'arraybuffer'})
            .then(res => {
                const blob = new Blob([res.data], {type: 'application/octet-stream'});
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'people.xlsx';
                link.click();
            });
    }

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu)
    }

    const renderContent = () => {
        switch (selectedMenu) {
            case 'profitAll':

                return (
                    <>
                        <Title>Топ по людям</Title>
                        <Content>
                            <TableContainer component={Paper} style={{width: "30vw"}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Имя пользователя</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stat1.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">{item.username.split("@")[0]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Content>
                    </>
                )
            case 'profitGames':

                return (
                    <>
                        <Title>Топ по заказам</Title>
                        <Content>
                            <TableContainer component={Paper} style={{width: "30vw"}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Название заказа</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stat2.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">{item.component.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Content>
                    </>
                )
            case 'profitDLC':

                return (
                    <>
                        <Title>Excel Заказы</Title>
                        <Content>
                            <button onClick={handleDownloadOrdersExcel}>Скачать</button>
                        </Content>
                    </>
                )
            case 'profitDLC2':

                return (
                    <>
                        <Title>Excel Люди</Title>
                        <Content>
                            <button onClick={handleDownloadPeopleExcel}>Скачать</button>
                        </Content>
                    </>
                )
            default:
                return null
        }
    }

    return (
        <>
            <MenuBar position="static">
                <Toolbar>
                    <div style={{color: "black"}}> Топ по людям</div>
                    <div style={{color: selectedMenu === 'profitAll' ? 'blue' : 'black', cursor: 'pointer'}}
                         onClick={() => handleMenuClick('profitAll')}>
                        <BarChart/>
                    </div>
                    <div style={{color: "black", marginLeft: "1vw"}}> Топ по заказам</div>
                    <div style={{color: selectedMenu === 'profitGames' ? 'blue' : 'black', cursor: 'pointer'}}
                         onClick={() => handleMenuClick('profitGames')}>
                        <BarChart/>
                    </div>
                    <div style={{color: "black", marginLeft: "1vw"}}> Excel Заказы</div>
                    <div style={{color: selectedMenu === 'profitDLC' ? 'blue' : 'black', cursor: 'pointer'}}
                         onClick={() => handleMenuClick('profitDLC')}>
                        <BarChart/>
                    </div>
                    <div style={{color: "black", marginLeft: "1vw"}}> Excel Люди</div>
                    <div style={{color: selectedMenu === 'profitDLC2' ? 'blue' : 'black', cursor: 'pointer'}}
                         onClick={() => handleMenuClick('profitDLC2')}>
                        <BarChart/>
                    </div>
                </Toolbar>
            </MenuBar>
            {renderContent()}
        </>
    )
}

export default AdminPanel