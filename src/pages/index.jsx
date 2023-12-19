import * as StyledHome from "../components/StyledHome";
import {useContext} from "react";
import CurrencyContext from "../context/CurrencyContext";
import {convertCurrency} from "../lib/Currency";
import {useRouter} from "next/router";

const Home = () => {
    const currency = useContext(CurrencyContext)
    const router = useRouter()

    const games = []

    return (
        <StyledHome.HomeContainer>
            <StyledHome.HomeTitle>Популярные новинки</StyledHome.HomeTitle>
            <StyledHome.GameList>
                {games
                    .slice(-6)
                    .map((game, index) => (
                        <StyledHome.GameCard onClick={() => router.push(`/games/${game.id}`)} key={game.id}>
                            <StyledHome.GameImage src={game.image} alt={`Game Image ${index + 1}`}/>
                            <StyledHome.GameName>{game.name}</StyledHome.GameName>
                            <StyledHome.GamePrice>{convertCurrency(currency, game.price)}</StyledHome.GamePrice>
                            <StyledHome.GameDescription>{game.description}</StyledHome.GameDescription>
                        </StyledHome.GameCard>
                    ))}
            </StyledHome.GameList>
        </StyledHome.HomeContainer>
    )
}

export default Home
