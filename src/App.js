import logo from './logo.svg';
import { fetchCardsOf, getBalance, readCount } from './api/UseCaver';
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import { useState } from 'react';
import * as KlipAPI from "./api/UseKlip";
import { Alert, Card, Container, Form, Nav, Button } from 'react-bootstrap';
import { MARKET_CONTRACT_ADDRESS } from './constants';

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000";
const MY_ADDRESS = "0xa6baC3b4E639b8782920a6FF01EBDe119EdDc9ac";
function App() {
  //tab
  //mintInput
  // Modal
  


  //onClickMycard
  //onClickMarketCard
  //gatUseData
  //getBalnce(0xaddress)

  // State Data

  //Global Data
  //address
  //nft
  const [nfts, setNfts] = useState([]);// {tokenId: '101', tokenUri:''} -> { id: '101}, uri:''}
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(MY_ADDRESS);

  //UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MINT");// MARKET, MINT, WALLET
  const [mintImageUrl, setMintImageUrl] = useState("");

  //fetchMarketNFTs
  const fetchMarketNFTs = async() =>{
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  }
  //fetchMyNFTs
  const fetchMyNFTs = async() =>{
    // balanceOf =>내가 가진 nft 토근 개수를 가져옴
    // tokenbOfOwnerByIndex => 내가 가지 NFT token ID를 하나씩 가져온다 (배열로)
    // otkenURI => 앞에서 가져온 ID 를 이용해서 tokenUri를 가져온다
    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts); 
  }
  //onClickMint
  const onClickMint = async (uri)=>{
    if(myAddress === DEFAULT_ADDRESS) alert("NO ADDRESS!!");
    const randomTokenId = parseInt(Math.random() * 10000000);
    KlipAPI.mintCardWithURI(
      myAddress,
      randomTokenId,
      uri,
      setQrvalue,
      (result) =>{
        alert(JSON.stringify(result));
      })
  }

  const onClickCard = (id)=>{
    if(tab === 'WALLET'){
      onClickMyCard(id);
    }else if(tab === 'MARKET'){
      onClickMarketCard(id);
    }
  }

  const onClickMyCard = (tokenId) =>{
    KlipAPI.listingCard(
      myAddress,
      tokenId,
      setQrvalue,
      (result) =>{
        alert(JSON.stringify(result));
      }
    );
  }

  const onClickMarketCard = (tokenId) =>{
    KlipAPI.buyCard(
      tokenId,
      setQrvalue,
      (result) =>{
        alert(JSON.stringify(result));
      }
    )
  }
  const getUserData = () =>{
    KlipAPI.getAddress(setQrvalue, async (address)=>{
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  }

  // readCount();
  // getBalance("0x1d9722655fcdce9e3adc8d36bacecc4786f62592");
  const onClickgetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };
  // const onClicksetCount = () => {
  //   KlipAPI.setCount(2000, setQrvalue);
  // };
      // 주소잔고
    // 갤러리
    // 발행 페이지
    // 탭
    // 모달
  return (
    <div className="App">
      <div style={ {backgroundColor: "black", padding: 10}}>
        {/* 주소잔고 */}
        <div
          style={{
            fontSize:30,
            fontWeight: "bold",
            paddingLeft:5,
            marginTop:10,
          }}>My Wallet</div>
        {myAddress}
        <br/>
        <Alert 
          onClick={() =>{getUserData()}}
          variant={"balance"}
          style={{
            backgroundColor: "#f44275",
            fontSize:25,
          }}>{myBalance}
        </Alert>
        <Container style={{
        background:"white",
        width:300,
        height:300,
        padding:20,
        }}>
          <QRCode 
            value={qrvalue}
            size={256}
            style={{margin: "auto"}}/>
        </Container>
          {/* 갤러리(마켓, 내지갑) */}
          {tab === "MARKET" || tab === "WALLET" ? (
            <div 
            className='container'
            style={{padding:0, width:"100%"}}>
              {nfts.map((nft, index)=>(
                <Card.Img 
                  key={`imagekey${index}`}
                  onClick={() => {
                    onClickCard(nft.id);
                  }} 
                  className='img-responsive' 
                  src={nfts[index].uri}
                  ></Card.Img>
              ))}
          </div>
          ) : null}

          {/* 발행 페이지 */}
          {tab === "MINT" ? 
          <div className='container' style={{padding:0, width:"100%"}}>
            <Card 
              className='text-center'
              style={{color:"black", height:"50%", borderColor:"#c5b358"}}>
              <Card.Body style={{opacity:0.9, backgroundColor:"black"}}>
                {mintImageUrl !== "" ? (<Card.Img src={mintImageUrl} height={"50%"}/>)
                : null}
                <Form>
                  <Form.Group>
                    {/* text input 칸 */}
                    <Form.Control
                      value={mintImageUrl}
                      onChange={(e)=>{
                        console.log(e.target.value);
                        setMintImageUrl(e.target.value);
                      }}
                      type="text"
                      placeholder='이미지 주소 입력해주세요'
                      />
                  </Form.Group>
                  <Button 
                  onClick={()=>{
                    onClickMint(mintImageUrl)
                  }}
                  variant='primary'
                  style={{backgroundColor: "#810034", borderColor: "#810034",}}
                  >발행하기</Button>
                </Form>
              </Card.Body>
            </Card>
          </div> : null}
      </div>
      <button onClick={fetchMyNFTs}>
        NFT 불러오기
      </button>
      

      {/* 모달 */}
      {/* 탭 */}
      <nav style={{
        backgroundColor: "#1b1717",
        height:45
      }} className="navbar fixed-bottom navbar-light" role="navigation" >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div onClick={()=>{
              setTab("MARKET");
              fetchMarketNFTs();
            }}
              className="row d-flex flex-column justify-content-center align-item-center">
                <div>MARKET</div>
            </div>
            <div onClick={()=>{
              setTab("MINT");
            }}
              className="row d-flex flex-column justify-content-center align-item-center">
                <div>MINT</div>
            </div>
            <div onClick={()=>{
              setTab("WALLET");
              fetchMyNFTs();
            }}
              className="row d-flex flex-column justify-content-center align-item-center">
                <div>WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}

export default App;
