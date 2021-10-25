import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
const Chart = lazy(() => import("react-apexcharts"));
export default function PriceChart(props) {
  let series = [
    {
      name: "",
      data: props.data,
    },
  ];
  let options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
  };
  return (
    <>
      {props.loading ? (
        <div className="text-center mt-2">
          <Spin></Spin>
        </div>
      ) : (
        <div>
          {series.length ? (
            <Suspense fallback={<div></div>}>
              <Chart
                series={series}
                options={options}
                type={props.type}
                height={props.height}
              ></Chart>
            </Suspense>
          ) : (
            <div className="text-center text-muted">No data available</div>
          )}
        </div>
      )}
    </>
  );
}
