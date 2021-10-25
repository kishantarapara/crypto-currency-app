import React, { useEffect, useState, lazy, Suspense } from "react";

import { message } from "antd";

import { fetchPriceHistory } from "../../services/api_services";
import { roundUpTo } from "../Assets/Assets";

const Chart = lazy(() => import("react-apexcharts"));

export default function ChartForTable(props) {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    if (props.id) {
      let today = new Date();
      let start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
      );
      const payload = {
        interval: "m15",
        start: start.getTime(),
        end: today.getTime(),
      };
      getPriceHistory(props.id, payload);
    }
  });

  const getPriceHistory = (id, interval) => {
    fetchPriceHistory(id, interval)
      .then((res) => {
        if (res.data) {
          const data = res.data.data.map((i) => {
            let value = roundUpTo(parseFloat(i.priceUsd), 2);
            return [i.time, value];
          });
          setPriceHistory(data);
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.detail || "Something went wrong");
      });
  };

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      parentHeightOffset: 0,
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: true,
      colors: undefined,
      width: 2,
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  };

  return (
    <div>
      <Suspense fallback={<div></div>}>
        <Chart
          series={[{ name: "", data: priceHistory }]}
          options={options}
          type="line"
          height="80"
        ></Chart>
      </Suspense>
    </div>
  );
}
