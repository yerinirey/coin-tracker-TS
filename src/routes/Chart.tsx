import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";
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

function Chart() {
  // const params = useParams();
  const { coinId } = useOutletContext<IContext>();
  const { isLoading, data } = useQuery<IOhlc>(["ohlc", coinId], () =>
    fetchCoinHistory(`${coinId}`)
  );
  const seriesData = data?.map((i) => i[4]) ?? [];
  const [chart, setChart] = useState("line");
  const onClick = (shape: string) => {
    setChart(shape);
  };
  return (
    <div>
      <button onClick={() => onClick("line")}>Line</button>
      <button onClick={() => onClick("candle")}>Candle</button>
      {isLoading ? (
        "Loading chart..."
      ) : chart === "line" ? (
        <ReactApexChart
          type="line"
          series={[
            {
              name: "price",
              // data: data?.map((price) => parseFloat(price[4])) ?? [],
              data: seriesData,
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
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
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: {
                show: false,
              },
              // type: "datetime",
              categories: data?.map((item) => new Date(item[0]).toUTCString()),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
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
          series={[
            {
              name: "price",
              data: seriesData,
            },
          ]}
        />
      )}
    </div>
  );
}

export default Chart;
