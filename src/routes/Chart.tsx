import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { MdOutlineCandlestickChart, MdOutlineShowChart } from "react-icons/md";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
interface IContext {
  coinId: string;
}

interface IDataArray extends Array<number> {
  0: number; // timestamp
  1: number; // open
  2: number; // high
  3: number; // low
  4: number; // close
}

type IOhlc = IDataArray[];
const ChartButtons = styled.div`
  margin-left: 14px;
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

const Button = styled.button<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive ? props.theme.bgColor : props.theme.focusColor};
  border: 2px solid
    ${(props) =>
      props.isActive ? props.theme.accentColor : props.theme.focusColor};
  border-radius: 0.4rem;
  background-color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.boxColor};
  padding: 8px;
  &:hover {
    background-color: ${(props) => props.theme.accentColor};
    border: 2px solid ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.bgColor};
    cursor: pointer;
  }
`;

function Chart() {
  // const params = useParams();
  const { coinId } = useOutletContext<IContext>();
  const { isLoading, data } = useQuery<IOhlc>(
    ["ohlc", coinId],
    () => fetchCoinHistory(`${coinId}`),
    {
      retry: 1,
      retryDelay: 10 * 60 * 1000,
      // enabled: false,
    }
  );
  const [chart, setChart] = useState("line");
  const onClick = (shape: string) => {
    setChart(shape);
  };
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <div>
      <ChartButtons>
        <Button isActive={chart === "line"} onClick={() => onClick("line")}>
          <MdOutlineShowChart size={20} />
        </Button>
        <Button isActive={chart === "candle"} onClick={() => onClick("candle")}>
          <MdOutlineCandlestickChart size={20} />
        </Button>
      </ChartButtons>
      {isLoading ? (
        "Loading chart..."
      ) : !data ? (
        "No data"
      ) : chart === "line" ? (
        // 종가를 선으로 이은 3주간의 그래프
        <ReactApexChart
          type="line"
          series={[
            {
              name: "price",
              // data: data?.map((price) => parseFloat(price[4])) ?? [],
              data: data.map(([t, o, h, l, c]) => ({
                x: new Date(t).toUTCString(),
                y: c,
              })),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 300,
              width: 600,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            grid: {
              show: false,
            },
            yaxis: {
              show: false,
              title: {
                text: "Close Price",
              },
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: {
                show: false,
              },
              // type: "datetime",
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value: number) => `$${value.toFixed(3)}`,
              },
            },
          }}
        />
      ) : (
        <ReactApexChart
          type="candlestick"
          series={[
            {
              name: "price",
              // data: data?.map((price) => parseFloat(price[4])) ?? [],
              data: data.map(([t, o, h, l, c]) => ({
                x: new Date(t).toUTCString(),
                y: [o, h, l, c],
              })),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              // type: "candlestick",
              height: 350,
              width: 600,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: {
                show: false,
              },
              type: "datetime",
            },
            fill: {
              type: "solid",
            },
            plotOptions: {
              candlestick: {
                wick: {
                  useFillColor: true,
                },
                colors: {
                  upward: "#0fbcf9",
                  downward: "#ff2222",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
