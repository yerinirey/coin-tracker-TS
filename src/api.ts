const BASE_URL = `https://api.coingecko.com/api/v3/coins`;

export function fetchCoins() {
  return fetch(
    `${BASE_URL}/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`,
    {
      credentials: "same-origin",
    }
  ).then((response) => response.json());
}

export function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/${coinId}?localization=false`).then((response) =>
    response.json()
  );
}
export function fetchCoinHistory(coinId: string) {
  return fetch(`${BASE_URL}/${coinId}/ohlc?vs_currency=usd&days=14`).then(
    (response) => response.json()
  );
}
// export function fetchCoinCosts(coinId: string) {
//   return fetch(`${BASE_URL}/${coinId}/market_chart?vs_currency=usd&days=`);
// }
