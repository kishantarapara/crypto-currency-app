import React, { useEffect, useState } from "react";

import { message, Radio } from "antd";
import { AreaChartOutlined, SlidersOutlined } from "@ant-design/icons";

import { history } from "../../services/history";
import { roundUpTo } from "../Assets/Assets";
import Chart from "../PriceChart/PriceChart";
import {
  fetchAssetById,
  fetchCandles,
  fetchPriceHistory,
} from "../../services/api_services";

import "./Details.scss";

export default function Details(props) {
  const cssPrefix = "asset-details-page";

  const [assetId, setAssetId] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetSymbol, setAssetSymbol] = useState("");
  const [assetData, setAssetData] = useState({});
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeInterval, setTimeInterval] = useState("d1");
  const [lastCandleData, setLastCandleData] = useState({});
  const [chartType, setChartType] = useState("area");
  const [candleData, setCandleData] = useState([]);

  const getAssetDetails = (id) => {
    fetchAssetById(id)
      .then((res) => {
        if (res.data) {
          setAssetData(res.data.data);
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.response.data.detail);
      });
  };

  const getPriceHistory = (id, interval) => {
    const payload = { interval };
    fetchPriceHistory(id, payload)
      .then((res) => {
        if (res.data) {
          const data = res.data.data.map((i) => [
            i.time,
            roundUpTo(parseFloat(i.priceUsd), 2),
          ]);
          setPriceHistory(data);
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.response.data.detail);
      });
  };

  const getLastCandleData = (interval, id) => {
    let payload = {
      exchange: "binance",
      interval,
      baseId: id,
      quoteId: "tether",
    };
    fetchCandles(payload)
      .then((res) => {
        if (res.data) {
          const { data } = res.data;
          let last = data.pop();
          setLastCandleData(last ?? {});
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.response.data.detail);
      });
  };

  const getCandleData = (interval, id) => {
    let payload = {
      exchange: "binance",
      interval,
      baseId: id,
      quoteId: "tether",
    };
    fetchCandles(payload)
      .then((res) => {
        if (res.data) {
          let { data } = res.data;
          data = data.map((i) => {
            return {
              x: i.period,
              y: [
                roundUpTo(parseFloat(i.open), 2),
                roundUpTo(parseFloat(i.high), 2),
                roundUpTo(parseFloat(i.low), 2),
                roundUpTo(parseFloat(i.close), 2),
              ],
            };
          });
          setCandleData(data);
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.response.data.detail);
      });
  };

  useEffect(() => {
    if (history?.location?.state) {
      const { id, name, symbol } = history.location.state;
      setAssetId(id);
      setAssetName(name);
      setAssetSymbol(symbol);
      getAssetDetails(id);
      getLastCandleData("d1", id);
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (assetId) {
      if (chartType === "area") {
        getPriceHistory(assetId, timeInterval);
      } else {
        getCandleData(timeInterval, assetId);
      }
    }
  }, [assetId, timeInterval, chartType]);

  return (
    <div className={cssPrefix}>
      <div className={`${cssPrefix}__header`}>
        <div className={`${cssPrefix}__header-name`}>{assetName}</div>
        <div className={`${cssPrefix}__header-id`}>{assetSymbol}</div>
      </div>

      <div className={`${cssPrefix}__asset-details`}>
        <div>
          <div className={`${cssPrefix}__asset-detail-label`}>PRICE</div>
          <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
            parseFloat(assetData.priceUsd),
            2
          )}`}</div>
        </div>
        <div>
          <div className={`${cssPrefix}__asset-detail-label`}>
            24 HOUR % CHANGE
          </div>
          <div
            className={`${cssPrefix}__asset-detail-value ${cssPrefix}${
              roundUpTo(parseFloat(assetData.changePercent24Hr), 2) >= 0
                ? "__green-text"
                : "__red-text"
            }`}
          >{`${roundUpTo(parseFloat(assetData.changePercent24Hr), 2)}%`}</div>
        </div>
        <div>
          <div className={`${cssPrefix}__asset-detail-label`}>MARKET CAP</div>
          <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
            parseFloat(assetData.marketCapUsd) / Math.pow(10, 9),
            2
          )}B`}</div>
        </div>
        <div>
          <div className={`${cssPrefix}__asset-detail-label`}>VOLUME (24H)</div>
          <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
            parseFloat(assetData.volumeUsd24Hr) / Math.pow(10, 9),
            2
          )}B`}</div>
        </div>
      </div>
      <div className={`${cssPrefix}__chart-box`}>
        <div className={`${cssPrefix}__interval-options`}>
          <div>
            <Radio.Group
              value={chartType}
              onChange={(e) => {
                setChartType(e.target.value);
              }}
            >
              <Radio.Button value="area">
                <AreaChartOutlined />
              </Radio.Button>
              <Radio.Button value="candlestick">
                <SlidersOutlined />
              </Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <Radio.Group
              value={timeInterval}
              onChange={(e) => setTimeInterval(e.target.value)}
            >
              <Radio.Button value="h1">1H</Radio.Button>
              <Radio.Button value="h12">12H</Radio.Button>
              <Radio.Button value="d1">1D</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {chartType === "candlestick" && (
          <Chart
            height="450"
            loading={false}
            type={"candlestick"}
            data={candleData}
          />
        )}
        {chartType === "area" && (
          <Chart
            height="450"
            loading={false}
            type={"area"}
            data={priceHistory}
          />
        )}
      </div>
      <div className={`${cssPrefix}__key-metrics`}>
        <div className={`${cssPrefix}__key-metrics-title`}>Key Metrics</div>
        <hr></hr>
        <div className={`${cssPrefix}__key-netrics-details`}>
          <div>
            <div className={`${cssPrefix}__asset-detail-label`}>
              24 HOUR LOW
            </div>
            <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
              parseFloat(lastCandleData.low),
              2
            )}`}</div>
          </div>
          <div>
            <div className={`${cssPrefix}__asset-detail-label`}>
              24 HOUR HIGH
            </div>
            <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
              parseFloat(lastCandleData.high),
              2
            )}`}</div>
          </div>
          <div>
            <div className={`${cssPrefix}__asset-detail-label`}>NET CHANGE</div>
            <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
              parseFloat(lastCandleData.close) -
                parseFloat(lastCandleData.open),
              2
            )}`}</div>
          </div>
          <div>
            <div className={`${cssPrefix}__asset-detail-label`}>
              24 HOUR OPEN
            </div>
            <div className={`${cssPrefix}__asset-detail-value`}>{`$${roundUpTo(
              parseFloat(lastCandleData.open),
              2
            )}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
