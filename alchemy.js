const { Alchemy, Network } = require("alchemy-sdk");
require("dotenv").config();

// alchemy private key
const KEY = process.env.KEY;

//configuration settings
const config = {
  apiKey: KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// first page of transaction
async function firstPage() {
  const res = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    contractAddresses: [
      "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    ] /*boredApe contract address*/,
    excludeZeroValue: true /*removes transactions with zero value*/,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    order: "desc" /*order of transactions*/,
  });

  const firstPage = await res;
  let pageKey = firstPage.pageKey;

  //second page of transactions
  const secondPage = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    contractAddresses: ["0xB8c77482e45F1F44dE1745F52C74426C631bDD52"],
    excludeZeroValue: true,
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    order: "desc",
    pageKey: pageKey.toString(),
    //maxCount: 0X1F4 ---- supposed to return just 500 transactions of the second page
  });

  //empty array of transactions
  const arrayOfResultsValue = [];
  const arrayOfResults = [];

  //for loop of all events in first page of the transactions
  for (const events of res.transfers) {
    //push to empty array of transactions
    arrayOfResultsValue.push(events.value);
    arrayOfResults.push(events);
  }

  //for loop of all events in second page of the transactions
  for (const events of secondPage.transfers) {
    //push to empty array of transactions
    arrayOfResultsValue.push(events.value);
    arrayOfResults.push(events);
  }

  //reduce array to 1500 results
  const newArrayOfResultsValue =
    arrayOfResultsValue.length > 1500
      ? arrayOfResultsValue.slice(500)
      : arrayOfResultsValue;

  //1. sum of all last 1500 transactions
  console.log(
    newArrayOfResultsValue.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0)
  );
  //2. highest sender's address, first get highest amount sent
  const highestSenderAmount = arrayOfResultsValue.reduce((a, b) => {
    return Math.max(a, b);
  });
  console.log(arrayOfResults.find((value) => value > highestSenderAmount));

  //3. highest recievers's address

  console.log(arrayOfResults.find((to) => to === highestSenderAmount));
}

firstPage();
