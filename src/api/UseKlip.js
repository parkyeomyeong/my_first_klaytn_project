import axios from "axios";
// import { valueTransferMemo } from "caver-js/packages/caver-transaction";
// import { txTypeToString } from "caver-js/packages/caver-utils";
import { COUNT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constants";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";

export const buyCard = async (
  tokenId, 
  setQrvalue, 
  callback
  )=>{
    const functionJson = '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFT", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }'
    excuteContract(
      MARKET_CONTRACT_ADDRESS, 
      functionJson, 
      "10000000000000000", 
      `[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`, 
      setQrvalue, 
      callback
    );
}

//market에 내 작품 올리는거 같네
// market한테 safetransferfrom 할꺼기 때문에 toAddress가 없음
export const listingCard = async (
  fromAddress, 
  tokenId, 
  setQrvalue, 
  callback
  )=>{
    const functionJson = '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    excuteContract(
      NFT_CONTRACT_ADDRESS, 
      functionJson, 
      "0", 
      `[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`, 
      setQrvalue, 
      callback
    );
}

export const mintCardWithURI = async (
  toAddress, 
  tokenId, 
  uri, 
  setQrvalue, 
  callback
  )=>{
    // const functionJson = '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    const functionJson = 
    '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
    excuteContract(
      NFT_CONTRACT_ADDRESS, 
      functionJson, 
      '0', 
      `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
      setQrvalue, 
      callback
    );
};

export const excuteContract = (
  txTo,
  functionJSON,
  value,
  params,
  setQrvalue,
  callback
)=>{
  axios
  .post(A2P_API_PREPARE_URL, {
    bapp: {
      name: APP_NAME,
    },
    type: "execute_contract",
    transaction: {
      from:"0xa6baC3b4E639b8782920a6FF01EBDe119EdDc9ac",
      to: txTo,
      abi: functionJSON,
      value: value,
      params: params,
    },
  })
  .then((response) => {
    const { request_key } = response.data;
    console.log(request_key);
    const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    setQrvalue(qrcode);
    let timerId = setInterval(() => {
      axios
        .get(
          `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
        )
        .then((res) => {
          // console.log(res);
          if (res.data.result) {
            console.log(`[Result] ${JSON.stringify(res.data.result)}`);
            if(res.data.result.status === 'success'){
              callback(res.data.result);
              clearInterval(timerId);
            }
          }
        });
    }, 1000);
  });
};

export const getAddress = (setQrvalue, callback) => {
    axios.post(
        "https://a2a-api.klipwallet.com/v2/a2a/prepare",{
            bapp:{
                name: APP_NAME
            },
            type: "auth",
        }).then((response)=>{
        const {request_key} = response.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);
        let timerId = setInterval(()=>{
            axios
                .get(
                    `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
                ).then((res)=>{
                if(res.data.result){
                    console.log(`{Result} ${JSON.stringify(res.data.result)}`);
                    callback(res.data.result.klaytn_address);
                    clearInterval(timerId);
                }
            });
        }, 1000);
    });
};

// export const setCount = (count, setQrvalue) => {
//   axios
//     .post(A2P_API_PREPARE_URL, {
//       bapp: {
//         name: APP_NAME,
//       },
//       type: "execute_contract",
//       transaction: {
//         to: COUNT_CONTRACT_ADDRESS,
//         abi:
//           '{ "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
//         value: "0",
//         params: `[\"${count}\"]`,
//       },
//     })
//     .then((response) => {
//       const { request_key } = response.data;
//       const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
//       setQrvalue(qrcode);
//       let timerId = setInterval(() => {
//         axios
//           .get(
//             `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
//           )
//           .then((res) => {
//             if (res.data.result) {
//               console.log(`[Result] ${JSON.stringify(res.data.result)}`);
//               if(res.data.result.status === 'success'){
//                 clearInterval(timerId);
//               }
//             }
//           });
//       }, 1000);
//     });
// };
