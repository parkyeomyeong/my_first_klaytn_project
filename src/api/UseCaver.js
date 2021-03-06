import Caver from "caver-js";
// import CounterABI from "../abi/CounterABI.json";
import KIP17ABI from "../abi/KIP17TOkenABI.json";

import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, NFT_CONTRACT_ADDRESS, CHAIN_ID} from "../constants/index";


// 1 smart contract 배포 주소 파악(가져오기)
// 2 caver.js 이용해서 스마트 컨트렉트 만들기
// 3 가져온 스마트 컨트렉트 실행 결과(데이터) 앱에 표현하기

export const option = {
    headers: [
      {name: 'Authorization', value: 'Basic ' + Buffer.from(ACCESS_KEY_ID + ':' + SECRET_ACCESS_KEY).toString('base64')},
      {name: 'x-chain-id', value: CHAIN_ID},
    ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);

export const fetchCardsOf = async (address)=>{
  //Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call();
  // console.log(balance);
  //Fetch Token Ids
  const tokenIds = [];
  for(let i = 0; i < balance ; i++){
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address,i).call();
    tokenIds.push(id);
  }
  //Fetch Token URIs
  const tokenUris = [];
  for(let i = 0; i < balance ; i++){
    const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    tokenUris.push(uri);
  }

  const nfts = [];
  for(let i = 0; i< balance ; i++){
    nfts.push({uri: tokenUris[i], id: tokenIds[i]});
  }

  console.log(nfts);

  return nfts;
}


export const getBalance = (address) =>{
    return caver.rpc.klay.getBalance(address).then((response) =>{
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      console.log(`BALANCE : ${balance}`);
      return balance;
    })
  };

//const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);
  
// export const readCount = async ()=>{
//     const _count =  await CountContract.methods.count().call();
//     console.log("count is : " + _count);
// };

// export const setCount = async (newCount) =>{
//     try {
//       //사용할 account 설정
//       const privatkey = "0x0e457cf287f2f367ba5eb0d802746532a7dc300eff1f36354f348a3af7ef3bea";
//       const deployer = caver.wallet.keyring.createFromPrivateKey(privatkey);
//       caver.wallet.add(deployer);
//       //스마트 컨트랙트 실행 프랜잭션 날리기
//       //결과 확인
//       const receipt = await CountContract.methods.setCount(newCount).send({
//         from: deployer.address, // address
//         gas: "0x4bfd200"//
//       })
  
//       console.log(receipt);
//     } catch (error) {
//       console.log("err :" + error);
//     }
    
//   }
  