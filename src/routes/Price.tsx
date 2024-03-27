import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import { PiChartLineDown, PiChartLineUp } from "react-icons/pi";
interface IContext {
  coinId: string;
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

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  /* background-color: teal; */
`;

const Box = styled.div`
  background-color: ${(props) => props.theme.boxColor};
  border: 1px solid ${(props) => props.theme.accentColor};
  border-radius: 0.4rem;
  padding: 20px 16px;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  gap: 6px;
  svg {
    margin: -8px;
  }
`;
const Percentage = styled.div<{ isminus: boolean }>`
  display: flex;
  flex-direction: column;
  :first-child {
    font-size: 16px;
    color: ${(props) => props.theme.textColor};
    font-weight: 450;
  }
  :last-child {
    font-size: 36px;
    font-weight: 550;
    color: ${(props) => (props.isminus ? props.theme.red : props.theme.green)};
  }
`;
function Price() {
  const { coinId } = useOutletContext<IContext>();
  const { isLoading, data } = useQuery<IInfoData>(["info", coinId]);
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>data Loading...</div>
      ) : (
        <Container>
          <Box>
            {data.market_data.price_change_percentage_1h_in_currency.usd < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={
                data.market_data.price_change_percentage_1h_in_currency.usd < 0
              }
            >
              <span>1 hour</span>
              <span>
                {data.market_data.price_change_percentage_1h_in_currency.usd.toFixed(
                  3
                )}
                %
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_24h < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_24h < 0}
            >
              <span>24 hours</span>
              <span>
                {data.market_data.price_change_percentage_24h.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_7d < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_7d < 0}
            >
              <span>7 days</span>
              <span>
                {data.market_data.price_change_percentage_7d.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_14d < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_14d < 0}
            >
              <span>14 days</span>
              <span>
                {data.market_data.price_change_percentage_14d.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_30d < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_30d < 0}
            >
              <span>30 days</span>
              <span>
                {data.market_data.price_change_percentage_30d.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_60d < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_60d < 0}
            >
              <span>60 days</span>
              <span>
                {data.market_data.price_change_percentage_60d.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
          <Box>
            {data.market_data.price_change_percentage_1y < 0 ? (
              <PiChartLineDown size={64} color={"#ee5253"} />
            ) : (
              <PiChartLineUp size={64} color={"#10ac84"} />
            )}
            <Percentage
              isminus={data.market_data.price_change_percentage_1y < 0}
            >
              <span>1 year</span>
              <span>
                {data.market_data.price_change_percentage_1y.toFixed(3)}%
              </span>
            </Percentage>
          </Box>
        </Container>
      )}
    </>
  );
}

export default Price;
