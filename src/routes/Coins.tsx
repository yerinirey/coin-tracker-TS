import { Link, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { FaMoon, FaSun } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";
const Container = styled.div`
  padding: 0px 20px;
  max-width: 600px;
  margin: 0 auto;
`;
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
  position: absolute;
`;
const Header = styled.header`
  height: 13vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
`;
const ToggleBtn = styled.button`
  border: none;
  background-color: ${(props) => props.theme.textColor};
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.bgColor};
  border-radius: 0.8rem;
  &:hover {
    cursor: pointer;
  }
  position: absolute;
  right: 0;
  transform: translateX(-50px);
  margin-top: 10px;
`;
const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.boxColor};
  width: 100%;
  color: white;
  margin-bottom: 2px;
  a {
    padding: 20px;
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
  grid-template-columns: 10% 55% 35%;
  align-items: center;
`;
const CoinHeader = styled(CoinBox)`
  padding: 24px 14px;
  background-color: ${(props) => props.theme.boxColor};
  margin-bottom: 2px;
  border-radius: 24px 24px 4px 4px;
  text-align: end;
  span {
    font-weight: 400;
  }
  :first-child {
    text-align: start;
  }
  div {
    display: flex;
    justify-content: space-between;
  }
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
  padding: 2px 4px;
  border-radius: 0.3rem;
`;
const CoinPercentagePrice = styled.span`
  font-weight: lighter;
  color: ${(props) => props.theme.greyColor};
  font-size: 14px;
`;
const PercentageBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 6px;
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
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((curr) => !curr);
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data, error } = useQuery<ICoin[]>("allCoins", fetchCoins, {
    retry: 1,
    retryDelay: 2 * 60 * 1000,
  });
  console.log(data);
  return (
    <Container>
      <Helmet>
        <title>Top 50 Cryptos</title>
      </Helmet>
      <Header>
        <Title>Top 50 Cryptos</Title>
        <ToggleBtn onClick={toggleDarkAtom}>
          {isDark ? <FaSun /> : <FaMoon />}
        </ToggleBtn>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : data === undefined ? (
        <Loader>Data Loading...</Loader>
      ) : (
        <CoinsList>
          <CoinHeader>
            <span>#</span>
            <div>
              <span>name</span>
              <span>price</span>
            </div>
            <span>24h Change</span>
          </CoinHeader>
          {data?.map((coin, idx) => (
            <Coin key={coin.id}>
              <Link
                to={`/${coin.id}`}
                state={{
                  id: coin.id,
                }}
              >
                <CoinBox>
                  <div>{idx + 1}</div>
                  {/* 이미지, 코인이름 */}
                  <CoinContentOne>
                    <CoinName>
                      <Img src={coin.image} />
                      {coin.name}
                    </CoinName>
                    <div>${coin.current_price}</div>
                  </CoinContentOne>
                  {/* 변동폭 */}
                  <CoinContentTwo>
                    {coin.price_change_percentage_24h < 0 ? (
                      <PercentageBox>
                        <CoinPercentagePrice>
                          {coin.price_change_24h.toString().substring(0, 7)}
                        </CoinPercentagePrice>
                        <CoinPercentage isminus={true}>
                          ▾
                          {
                            coin.price_change_percentage_24h
                              .toFixed(2)
                              .split("-")[1]
                          }
                          %
                        </CoinPercentage>
                      </PercentageBox>
                    ) : (
                      <PercentageBox>
                        <CoinPercentagePrice>
                          +{coin.price_change_24h.toString().substring(0, 7)}
                        </CoinPercentagePrice>
                        <CoinPercentage isminus={false}>
                          ▴{coin.price_change_percentage_24h.toFixed(2)}%
                        </CoinPercentage>
                      </PercentageBox>
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
