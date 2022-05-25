import logo from './logo.svg';
import { getBalance, readCount, setCount } from './api/UseCaver';
import QRCode from "qrcode.react";
import './App.css';
import { useState } from 'react';
import * as KlipAPI from "./api/UseKlip";

function onPressButton(){
  console.log('hi');
}
const DEFAULT_QR_CODE = "DEFAULT";

function App() {
  const [balance, setBalance] = useState('0');
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const onPressButton2 = (balance)=>{
    setBalance('10');
  }
  // readCount();
  // getBalance("0x1d9722655fcdce9e3adc8d36bacecc4786f62592");
  const onClickgetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  };
  const onClicksetCount = () => {
    KlipAPI.setCount(2000, setQrvalue);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={()=>{onClickgetAddress()}}>
            주소가져오기
        </button>
        <button
          onClick={()=>{onClicksetCount()}}>
            acount값 변경
        </button>
        <p>{balance}</p>
        <br/>
        <QRCode value={qrvalue}/>
      </header>
    </div>
  );
}

export default App;
