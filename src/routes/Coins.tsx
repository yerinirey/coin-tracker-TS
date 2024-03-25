import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
const Container = styled.div`
  padding: 0px 20px;
  max-width: 800px;
  margin: 0 auto;
`;
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.boxColor};
  width: 100%;
  color: white;
  margin-bottom: 6px;
  border-radius: 4px;
  a {
    padding: 14px;
    display: flex;
    align-items: center;
  }
  &:hover {
    background-color: ${(props) => props.theme.focusColor};
  }
`;
const CoinBox = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 5% 50% 15%;
  align-items: center;
  text-align: center;
`;
const CoinContentOne = styled.div`
  /* width: 150%; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const CoinContentTwo = styled.div`
  display: flex;
  justify-content: end;
`;
const CoinName = styled.div`
  display: flex;
  align-items: center;
`;
interface IMinus {
  isminus: boolean;
}
const CoinPercentage = styled.span<IMinus>`
  background-color: ${($props) => ($props.isminus ? "#ee5253" : "#10ac84")};
  text-align: right;
  color: rgba(0, 0, 0, 0.6);
  padding: 4px 4px;
  border-radius: 0.3rem;
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;
interface ICoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}
const Loader = styled.span`
  text-align: center;
  display: block;
`;
function Coins() {
  /*
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);
  */
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>Top 50 Cryptos</title>
      </Helmet>
      <Header>
        <Title>Top 50 Cryptos</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin, idx) => (
            <Coin key={coin.id}>
              <Link
                to={`/${coin.id}`}
                state={{
                  id: coin.id,
                }}
              >
                <CoinBox>
                  <div>{idx + 1}</div>
                  <CoinContentOne>
                    <CoinName>
                      <Img src={coin.image} />
                      {coin.name}
                    </CoinName>
                    <div>${coin.current_price}</div>
                  </CoinContentOne>
                  <CoinContentTwo>
                    {coin.price_change_percentage_24h < 0 ? (
                      <CoinPercentage isminus={true}>
                        ▾
                        {
                          coin.price_change_percentage_24h
                            .toFixed(2)
                            .split("-")[1]
                        }
                        %
                      </CoinPercentage>
                    ) : (
                      <CoinPercentage isminus={false}>
                        ▴{coin.price_change_percentage_24h.toFixed(2)}%
                      </CoinPercentage>
                    )}
                  </CoinContentTwo>
                </CoinBox>
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
