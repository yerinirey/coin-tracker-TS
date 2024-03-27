import { useState } from "react";
import { Outlet, useLocation, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoinInfo } from "../api";
import { Helmet } from "react-helmet";

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
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.boxColor};
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
  font-weight: 400;
  line-height: 1.4;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.span<{ isActive: any }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.boxColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${($props) =>
    $props.isActive ? $props.theme.accentColor : $props.theme.textColor};
  a {
    display: block;
  }
`;
const Back = styled.div`
  background-color: ${(props) => props.theme.boxColor};
  border-radius: 10px;
  color: ${(props) => props.theme.textColor};
  padding: 8px 4px;
  position: absolute;
  left: 0;
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
  a {
    padding: 8px 4px;
  }
`;
const OpenBtn = styled.span`
  color: ${(props) => props.theme.accentColor};
  font-weight: 400;
  &:hover {
    cursor: pointer;
  }
`;
interface ILocation {
  state: {
    name: string;
  };
}

interface IMarketData {
  current_price: {
    usd: number; // 달러에 대한 가격
    krw: number; // 한국원화에 대한 가격
    eth: number; // 이더리움에 대한 가격
  };
  high_24h: {
    usd: number;
    krw: number;
    eth: number;
  };
  low_24h: {
    usd: number;
    krw: number;
    eth: number;
  };
  price_change_24h: number;
  price_change_percentage_1h_in_currency: {
    usd: number;
  };
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  total_supply: number;
  max_supply: number;
}
interface IInfoData {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: Array<string>;
  preview_listing: boolean;
  description: {
    en: string;
  };
  links: {
    homepage: Array<string>;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: IMarketData;
  last_updated: string;
  // tickers: object;
}
const CurrentPrice = styled.span`
  color: ${(props) => props.theme.accentColor};
`;

function Coin() {
  const { coinId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useLocation() as ILocation;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const onOpen = () => setIsOpen(!isOpen);
  const { isLoading, data } = useQuery<IInfoData>(
    ["info", coinId],
    () => fetchCoinInfo(`${coinId}`),
    {
      retry: 1,
      retryDelay: 2 * 60 * 1000,
    }
  );
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : isLoading ? "Loading..." : data?.name}
        </title>
      </Helmet>
      <Header>
        <Back>
          <Link to="/">&larr; back</Link>
        </Back>
        <Title>
          {state?.name ? state.name : isLoading ? "Loading..." : data?.name}
        </Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{data?.market_cap_rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{data?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <CurrentPrice>{`$${data?.market_data.current_price.usd}`}</CurrentPrice>
            </OverviewItem>
          </Overview>
          <Description>
            {isOpen ? (
              <>
                {data?.description.en}
                <OpenBtn onClick={onOpen}>close</OpenBtn>
              </>
            ) : (
              <>
                {data?.description.en.substring(0, 400)}
                <OpenBtn onClick={onOpen}>...more</OpenBtn>
              </>
            )}
          </Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{data?.market_data.total_supply ?? "unprovided"}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{data?.market_data.max_supply ?? "unprovided"}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId: `${coinId}` }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
