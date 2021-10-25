import React, { useEffect, useState } from "react";

import { Button, Table, Input, message } from "antd";

import { fetchAssets } from "../../services/api_services";
import { history } from "../../services/history";

import "./Assets.scss";
import ChartForTable from "../ChartForTable/ChartForTable";

export default function Asstes() {
  const cssPrefix = "assets-page";
  const { Search } = Input;

  const [assetsData, setAssetsData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchText, setSearchText] = useState("");

  // can use for server side pagination, but api does not provide total count so server side pagination is not possible in this api
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getAssets(searchText);
  }, [searchText]);

  const getAssets = (search) => {
    setFetching(true);
    fetchAssets({
      // limit: pagesize,
      // offset: (currentPage - 1) * pageSize,
      search,
    })
      .then((res) => {
        if (res.data) {
          setAssetsData(res.data.data);
        } else {
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        message.error(error.reaspose.data.detail);
      })
      .finally(() => setFetching(false));
  };

  const doSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      align: "center",
      key: "rank",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <div>
            <img
              alt=""
              className={`${cssPrefix}__crypto-logo`}
              src={`https://assets.coincap.io/assets/icons/${record.symbol.toLowerCase()}@2x.png`}
            />{" "}
            <b>{text}</b> <span>{record.symbol}</span>
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "priceUsd",
      key: "priceUsd",
      align: "right",
      render: (text) => {
        return `$${roundUpTo(parseFloat(text), 2)}`;
      },
    },
    {
      title: "24h %",
      dataIndex: "changePercent24Hr",
      key: "changePercent24Hr",
      align: "right",
      render: (text) => {
        const change = roundUpTo(parseFloat(text), 2);
        return (
          <div
            className={
              change < 0 ? `${cssPrefix}__red-text` : `${cssPrefix}__green-text`
            }
          >{`${change}%`}</div>
        );
      },
    },
    {
      title: "VWAP(24h)",
      dataIndex: "vwap24Hr",
      key: "vwap24Hr",
      align: "right",
      render: (text) => {
        return `$${roundUpTo(parseFloat(text), 2)}`;
      },
    },
    {
      title: "Max Supply",
      dataIndex: "maxSupply",
      key: "maxSupply",
      align: "right",
      render: (text, record) => {
        return roundUpTo(parseFloat(text), 0)
          ? `${roundUpTo(parseFloat(text), 0)} ${record.symbol}`
          : "-";
      },
    },
    {
      title: "Market Cap",
      dataIndex: "marketCapUsd",
      key: "marketCapUsd",
      align: "right",
      render: (text) => {
        return `$${roundUpTo(parseFloat(text), 2)}`;
      },
    },
    {
      title: "Volume(24h)",
      dataIndex: "volumeUsd24Hr",
      key: "volumeUsd24Hr",
      align: "right",
      render: (text, record) => {
        const volumeInUsd = roundUpTo(parseFloat(text), 0);
        const volumeInCount = roundUpTo(volumeInUsd / record.priceUsd, 0);

        return (
          <div>
            <div>{`$${volumeInUsd}`}</div>
            <div
              className={`${cssPrefix}__secondery-text`}
            >{`${volumeInCount} ${record.symbol}`}</div>
          </div>
        );
      },
    },
    {
      title: "Last 7 Days",
      align: "center",
      width: "10%",
      render: (text, record) => {
        return <ChartForTable id={record.id} />;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => {
        return (
          <Button
            onClick={() =>
              history.push({
                pathname: "/details",
                state: { ...record },
              })
            }
          >
            Open Details
          </Button>
        );
      },
    },
  ];

  return (
    <div className={cssPrefix}>
      <div className={`${cssPrefix}__search-wrapper`}>
        <div className={`${cssPrefix}__search-box`}>
          <Search
            placeholder="Search"
            size="large"
            onSearch={doSearch}
            enterButton
          />
        </div>
      </div>
      <Table
        rowKey="symbol"
        loading={fetching}
        columns={columns}
        dataSource={assetsData}
        pagination={{ pageSizeOptions: [5, 10, 25, 50] }}
        // onChange={(pagination) => {
        //   setCurrentPage(pagination.current);
        //   setPageSize(pagination.pageSize);
        // }}
      />
    </div>
  );
}

const roundUpTo = (floatNumber, decimalPoints) => {
  if (isNaN(floatNumber)) floatNumber = 0;
  return (
    Math.round(floatNumber * Math.pow(10, decimalPoints)) /
    Math.pow(10, decimalPoints)
  );
};

export { roundUpTo };
