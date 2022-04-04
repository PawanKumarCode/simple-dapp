import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import MoodDiary from './utils/MoodDiary.json';

const CONTRACT_ADDRESS = "0x78Bb667D7B9258F9CDe089F789b390896dcAdD72";
const MUMBAI_CHAINID = "0x13881";





function App() {


  //a state varuable we use to store our user's public wallet. 
  // Use import useState to use it here
  const [currentAccount, setCurrentAccount] = useState("");



  // connectWallet method
  //connects user wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get MetaMask!");
        return;
      }

      //check if we are on correct network polygon mumbai network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to  chain " + chainId);

      if (chainId !== MUMBAI_CHAINID) {
        alert("you are not connected to the Mumbai Test Network!");
        return;
      }

      //request access to the account 
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      //print public address once we have it 
      console.log("Coonected", accounts[0]);
      setCurrentAccount(accounts[0]);

      //For the user who connects his/her wallet for the first time
      //setupEventListener();


    } catch (error) {
      console.log(error);
    }
  }

  // Render wallet not connected 
  const renderNotConnectedContainer = () => (
    <div>
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    </div>
  );
  //this runs our function when the page loads
  useEffect(() => {

    /*
  check if the user's wallet is already connected
  */
    const checkIfWalletIsConnected = async () => {

      //First make sure we have access to the windw.ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      //check if we are on correct network polygon mumbai network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to  chain " + chainId);

      if (chainId !== MUMBAI_CHAINID) {
        alert("you are not connected to the Mumbai Test Network!");
        return;
      }


      //check if we are authorised to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      //user can have multiple authorised accounts, we grab the first one if its there

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);



        //for the situation where a user has already connected and authorized their wallet and comes back to out site
        // setupEventListener();
      } else {
        console.log("No authorized account found");
      }

    }
    checkIfWalletIsConnected();
  }, [])




  /*
    Get Mood
    */
  const getMood = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        //check if we are on correct network polygon mumbai network
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to  chain " + chainId);

        if (chainId !== MUMBAI_CHAINID) {
          alert("you are not connected to the Mumbai Test Network!");
          return;
        }

        // //start loader sppiner animation
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MoodDiary.abi, signer);

        console.log("Going to pop wallet now to pay gas...");


        let mood = connectedContract.getMood();

        console.log("Mood is ", mood);


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      //some error occured stop loading animation
      // setLoading(false);
      console.log(error);
    }
  }



  /*
    Set Mood
    */
  const setMood = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        //check if we are on correct network polygon mumbai network
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to  chain " + chainId);

        if (chainId !== MUMBAI_CHAINID) {
          alert("you are not connected to the Mumbai Test Network!");
          return;
        }

        //start loader sppiner animation
        // setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MoodDiary.abi, signer);

        console.log("Going to pop wallet now to pay gas...");

        let txn = await connectedContract.setMood("Good");


        console.log("Setting...please wait");
        await txn.wait();

        let mood = connectedContract.getMood();

        console.log("Mood is ", mood);


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      //some error occured stop loading animation
      // setLoading(false);
      console.log(error);
    }
  }




  return (
    <div className="App">
      <header className="App-header">
        <h1>Mood setter Dapp</h1>
      </header>

      <main className="App-body">
        <p> Here we can set or get the mood:</p>
        {currentAccount === ""
          ? renderNotConnectedContainer()
          : (
            <div>
              <label htmlFor="mood">Input Mood:</label><br />
              <input type="text" id='mood' className="input-text" /><br />
              <button onClick={getMood} className="cta-button connect-wallet-button">Get Mood</button><br />
              <button onClick={setMood} className="cta-button connect-wallet-button" >Set Mood</button>
            </div>
          )
        }
      </main>
    </div>
  );
}

export default App;
