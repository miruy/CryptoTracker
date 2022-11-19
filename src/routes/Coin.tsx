import { useParams, useLocation } from "react-router";
import { useMatch, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  font-size: 20px;
  color: white;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
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
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouterState {
  state: {
    name: string;
  };
}

/* 
  console 창에서 API데이터 쉽게 타입 가져오는 방법
  1. API호출로 가져온 데이터를 'store object as global variable' 선택하여 전역변수에 저장
  2. Object.keys(temp1).join() : 전역변수로 저장한 데이터의 key만 string 형태로 보여줌
  3. Object.values(temp1).map(v => typeof v).join() : 전역변수로 저장한 데이터의 value만 배열 형식으로 만들어 string 형태로 보여줌
*/
interface infoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

// quotes: object -> quotes: { USD : { } }
// object내에 배열 형식의 데이터가 또 들어 있다면 object라는 타입으로 설명되기 때문에 이러한 타입은 직접 타입을 지정해야함
interface priceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

// react-router-dom 6버전에서 useParams()의 기본 값이 string으로 변경됨
// coinId : string 타입이지만 따로 interface타입 정의 안함
function Coin() {
  const { coinId } = useParams();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<infoData>(); // API 캡슐화 호출한 정보
  const [priceInfo, setPriceInfo] = useState<priceData>(); // API 캡슐화 호출한 정보
  const priceMatch = useMatch("/:coinId/price"); // useMatch() : ()에 작성한 특정한 url에 있는지를 null / 데이터(not null) 형태로 알려줌
  const chartMatch = useMatch("/:coinId/chart");

  // interface RouterState로부터 state 값을 바로 호출
  const { state } = useLocation() as RouterState;

  // 코인 detail 페이지로 이동 시 코인 API는 한번만 실행될 수 있게 하고
  // 즉시 함수가 실행될 수 있도록 execute 함수 ()() 사용
  // 캡슐화를 하여 응답의 대한 json 객체를 API로부터 받아옴
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      console.log(infoData);

      // 코인의 가격 정보를 불러오는 API 캡슐화 호출
      const priceData = await (
        await await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      console.log(priceData);

      // 위에 API 캡슐화 호출한 정보를 각 state에 set함
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);

  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{info?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>

          <Routes>
            <Route path="price" element={<Price />} />
            <Route path="chart" element={<Chart />} />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
