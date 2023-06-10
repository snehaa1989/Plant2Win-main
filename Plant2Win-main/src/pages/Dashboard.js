import { ethers } from "ethers";
import { useState, useEffect } from "react";
import ContractABI from "../abi.json";
import { networks } from '../networks';
import { CssBaseline, ThemeProvider, createTheme } from '@material-ui/core'
import { Switch } from '@material-ui/core'
const Dashboard = () => {
  const [theme, setTheme] = useState(false);
	const darkTheme = createTheme({
		palette: {
            type: theme ? 'dark' : 'light',
            primary: {
                main: '#00bfa5',
            },
            secondary: {
                main: '#ff9100',
            },
        },
	});
	const handleThemeChange = (event) => {
		setTheme(event.target.checked);
	}

  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [totalMoney, setTotalMoney] = useState(0.00);

  // Implement connectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window?.ethereum || {};


      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };


  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    }
  }

  const CONTRACT_ADDRESS = "0x0f70f14214BAe22b9e11fC966FF68f6389c28C3a";
 

  const  [inputValue, setInputValue] =  useState('');

	const  handleChange = (event) => {
		setInputValue(event.target.value);
	};


  const JoinPool = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

        let tx = await contract.deposit({value: ethers.utils.parseEther(inputValue)});
        }
      } catch(error) {
        console.log(error);
      }
  }

  const getWidthrawl = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

        let tx = await contract.balances(currentAccount);
        console.log("BAlance : "+tx)
        let tx2 = await contract.withdrawal(tx);
        // Wait for the transaction to be mined
        //const receipt = await tx.wait();

			
        }
      } catch(error) {
        console.log(error);
      }
  }

  const getMoney = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

        let tx = await contract.getEthHolding();
        setTotalMoney(parseFloat(tx/1000000000000000000))
        }
      } catch(error) {
        console.log(error);
      }
  }
  const [winnerList, setWinner] = useState([]);
  const [announceState, setAnnounceState] = useState("Announce Winner");
  const getWinners = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
        let tx = await contract.getRandomAddresses();
        console.log("WINNERS : "+tx)
        setWinner(tx)
        setAnnounceState("Distribute Funds")
        }
      } catch(error) {
        console.log(error);
      }
  }

  const distributeFunds = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
        let tx = await contract.sendEtherToUsers();
        setWinner([])
        setAnnounceState("Announce Winner")
        }
      } catch(error) {
        console.log(error);
      }
  }

  // console.log("Winners : - "+winnerList[9])


  const [seconds, setSeconds] = useState(2063400);
  const [remainingDays, setDays] = useState('');
  const [remainingHours, setHours] = useState('');
  const [remainingMin, setMin] = useState('');
  const [remainingSecs, setSecs] = useState('');

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [seconds]);

  useEffect(() => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    setDays(days)
    setHours(hours)
    setMin(minutes)
    setSecs(remainingSeconds)
    
  }, [seconds]);



  // Render Methods
  const renderNotConnectedContainer = () => (<>
    <center>
      <div className="text-6xl pt-32">
        <button onClick={connectWallet} className="rounded-lg bg-blue-300 hover:opacity-75 p-8">
          Connect Wallet
        </button>
      </div>
    </center>
  </>
  );

  const renderConnectedContainer = () => {
    if (network !== 'Polygon Mumbai Testnet') {
      return (<>
        <center>
          <div className="text-6xl pt-32">
            <h2>Please switch to Polygon Mumbai Testnet</h2>
            <br />
            {/* This button will call our switch network function */}
            <button className='rounded-lg bg-blue-300 hover:opacity-75 p-8' onClick={switchNetwork}>Click here to switch</button>
          </div>
        </center>
      </>
      );
    }
    return (
    <div>
      <div className="relative w-full h-[1202.5px] text-left text-smi text-gray font-inter">
      <ThemeProvider theme={darkTheme}>
      <div className="absolute top-[0px] left-[0px] w-[1440px] h-[1202.5px]">
      <CssBaseline />
        <div className="absolute w-full top-[77px] right-[0px] left-[0px] bg-pink h-[1125.5px] overflow-hidden">
          <img
            className="absolute top-[575.3px] left-[0px] w-[308px] h-[550.2px] opacity-[0.38]"
            alt=""
            src="/divgradientcircle.svg"
          />
          <img
            className="absolute right-[-188px] bottom-[725.5px] w-[400px] h-[400px] opacity-[0.38]"
            alt=""
            src="/divgradientcircle1.svg"
          />
          <div className="absolute top-[25px] left-[179px] w-[1152px] h-[980.5px] ">
            <div className="absolute top-[44px] left-[calc(50%_-_576px)] rounded-3xs bg-white w-[1152px] h-[241.5px]">
              <div className="absolute top-[24px] left-[0px] w-[576px] h-[193.5px]">
                <div className="absolute top-[calc(50%_-_87.5px)] left-[calc(50%_-_288px)] w-[576px] h-[26px]">
                  <div className="absolute top-[-1px] left-[56px] flex flex-row pt-0 pb-1.5 pr-[4.720001220703125px] pl-0 items-start justify-start">
                    <div className="relative leading-[21px]">{`Plant2Win > USDC Pool`}</div>
                  </div>
                  <img
                    className="absolute top-[0px] left-[503px] w-[17px] h-[26px] overflow-hidden"
                    alt=""
                    src="/svg1.svg"
                  />
                </div>
                <div className="absolute top-[calc(50%_-_61.5px)] left-[calc(50%_-_59.66px)] w-[119.3px] h-32 text-center text-xl">
                  <img
                    className="absolute top-[15.75px] left-[27.66px] w-[60px] h-[60px] object-cover"
                    alt=""
                    src="/image-3@2x.png"
                  />
                  <div className="absolute top-[88px] left-[40px] flex flex-row py-0 pr-[2.3000030517578125px] pl-px items-start justify-start">
                    <div className="relative leading-[36px]">$ {totalMoney}</div>
                  </div>
                </div>
                <div className="absolute top-[calc(50%_+_66.5px)] left-[calc(50%_-_288px)] w-[576px] h-[21px] text-xs">
                  <div className="absolute top-[-1px] left-[56px] flex flex-row pt-0 pb-px pr-[3.470001220703125px] pl-0 items-start justify-start">
                    <div className="relative leading-[21px]">
                      <span>{`Lottery `}</span>
                      <span className="font-semibold text-darkgreen-100">
                        #7
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-[-1px] left-[438.86px] flex flex-row pt-0 pb-px pr-[0.1399993896484375px] pl-0 items-start justify-start text-smi text-darkgreen-100">
                    <div className="relative leading-[21px]">
                      <span className="font-semibold">Monthly</span>
                      <span className="text-gray"> Prize</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[24px] left-[576px] w-[576px] h-[193.5px] text-lg text-whitesmoke">
                <div className="absolute top-[calc(50%_-_96.75px)] left-[calc(50%_-_148px)] rounded-3xs px-16 bg-pink-200 flex flex-row py-5 px-7 items-start justify-start gap-[16px] border-[2px] border-solid border-whitesmoke">
                  <div className="flex flex-col pt-0 px-0 pb-px items-center justify-start gap-[3px]">
                    <div className="relative rounded-3xl bg-gray w-12 h-12">
                      <div className="absolute top-[14.5px] left-[18.33px] leading-[27px] font-semibold flex items-center w-[11.54px] h-[18px]">
                        {remainingDays}
                      </div>
                    </div>
                    <div className="relative text-sm leading-[21px] text-gray">
                      Day
                    </div>
                  </div>
                  <div className="flex flex-col pt-0 px-0 pb-px items-center justify-start gap-[3px]">
                    <div className="relative rounded-3xl bg-gray w-12 h-12">
                      <div className="absolute top-[14.5px] left-[18.77px] leading-[27px] font-semibold flex items-center w-[10.65px] h-[18px]">
                        {remainingHours}
                      </div>
                    </div>
                    <div className="relative text-xs leading-[21px] text-gray">
                      Hr
                    </div>
                  </div>
                  <div className="flex flex-col pt-0 px-0 pb-px items-center justify-start gap-[3px] text-mini">
                    <div className="relative rounded-3xl bg-gray w-12 h-12">
                      <div className="absolute top-[14.5px] left-[14.39px] leading-[27px] font-semibold flex items-center w-[19.4px] h-[18px]">
                        {remainingMin}
                      </div>
                    </div>
                    <div className="relative text-smi leading-[21px] text-gray">
                      Min
                    </div>
                  </div>
                  <div className="flex flex-col pt-0 px-0 pb-px items-center justify-start gap-[3px] text-mini">
                    <div className="relative rounded-3xl bg-gray w-12 h-12">
                      <div className="absolute top-[14.5px] left-[15.3px] leading-[27px] font-semibold flex items-center w-[17.61px] h-[18px]">
                        {remainingSecs}
                      </div>
                    </div>
                    <div className="relative text-smi leading-[21px] text-gray">
                      Sec
                    </div>
                  </div>
                </div>
                <div className="absolute top-[calc(50%_+_40.25px)] left-[calc(50%_-_161.8px)] rounded-8xs bg-whitesmoke flex flex-row pt-4 pb-[17.5px] pr-[13.8699951171875px] pl-[13.72000122070312px] items-start justify-start text-center text-smi text-darkgreen-100 border-[1px] border-solid border-darkgreen-100">
                  
                  <input className="relative leading-[22.5px] pl-4 rounded-2xl" type="text"  value={inputValue} onChange={handleChange} />
                  <button onClick={JoinPool} className="relative  leading-[22.5px] ml-6">DEPOSIT</button>
        
                  <button onClick={getWidthrawl} className="relative leading-[22.5px] ml-6">WIDTHDRAW</button>
                </div>
              </div>
            </div>
            <div className="absolute top-[309.5px] left-[calc(50%_-_576px)] rounded-3xs bg-white w-[1152px] h-[198px] text-3xl">
              <div className="absolute top-[24px] left-[28px] flex flex-col py-1.5 px-0 items-start justify-start gap-[26px]">
                <b className="relative leading-[36px] flex items-center w-[111.51px] h-6 shrink-0">
                  Pool Stats
                </b>
                <div className="flex flex-row items-start justify-start gap-[24px] text-smi">
                  <div className="relative w-[91px] h-[70px]">
                    <div className="absolute top-[-1px] left-[0px] leading-[21px]">
                      Total Deposits
                    </div>
                    <div className="absolute top-[25px] left-[0px] flex flex-row py-0 pr-[11px] pl-0 items-start justify-start text-darkgreen-100">
                      <b className="relative leading-[24px]">{totalMoney} USDC</b>
                    </div>
                  </div>
                  <div className="relative w-[79.38px] h-[70px]">
                    <div className="absolute top-[-1px] left-[0px] leading-[21px]">
                      Yield Source
                    </div>
                    <b className="absolute top-[25px] left-[0px] text-sm leading-[24px] text-darkgreen-100">
                      Lending
                    </b>
                    <div className="absolute top-[48px] left-[0px] text-xs leading-[21px]">
                      Aave
                    </div>
                  </div>
                  <div className="relative w-[181.14px] h-[70px]">
                    <div className="absolute top-[-1px] left-[0px] leading-[21px]">
                      Reward Rate
                    </div>
                    <b className="absolute top-[25px] left-[0px] text-mini leading-[24px] text-darkgreen-100">
                      {totalMoney*0.05} USDT / Month
                    </b>
                    <div className="absolute top-[48px] left-[0px] leading-[21px]">
                      Increases as per TVL
                    </div>
                  </div>
                </div>
              </div>
              <img
                className="absolute top-[24px] left-[576px] rounded-3xs w-[548px] h-[150px]"
                alt=""
                src="/divcolspan12.svg"
              />
            </div>
            <div className="absolute top-[531.5px] left-[0px] w-[1152px] flex flex-row py-px px-0 box-border items-start justify-start gap-[34px] text-black">
              <div className="flex-1 rounded-3xs bg-white flex flex-col py-6 px-12 items-start justify-start gap-[16px]">
                <div className="flex flex-col py-1 px-0 items-start justify-start gap-[17px] text-3xl text-gray">
                  <b className="relative leading-[36px] flex items-center w-[191.17px] h-6 shrink-0">
                    Prize Distribution
                  </b>
                  <div className="relative text-smi leading-[21px] text-darkgreen-100 flex items-center w-[247.22px] h-3.5 shrink-0">
                    Prize split evenly between all 5 winners
                  </div>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[74.67px] h-3.5 shrink-0">
                    Grand Prize
                  </div>
                  <b className="relative text-sm leading-[24px] text-darkgreen-100">
                    {totalMoney*0.05*0.5}
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[85.22px] h-3.5 shrink-0">
                    1st Runner up
                  </div>
                  <b className="relative text-sm leading-[24px] text-darkgreen-100">
                  {totalMoney*0.05*0.25}
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[92.95px] h-3.5 shrink-0">
                    2nd Runner up
                  </div>
                  <b className="relative text-sm leading-[24px] text-darkgreen-100">
                  {totalMoney*0.05*0.15}
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[89.37px] h-3.5 shrink-0">
                    3rd Runner up
                  </div>
                  <b className="relative text-sm leading-[24px] text-darkgreen-100">
                  {totalMoney*0.05*0.05}
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[90.08px] h-3.5 shrink-0">
                    4th Runner up
                  </div>
                  <b className="relative text-sm leading-[24px] text-darkgreen-100">
                  {totalMoney*0.05*0.05}
                  </b>
                </div>
              </div>
              <div className="flex-1 rounded-3xs bg-white flex flex-col py-[22px] px-12 items-start justify-start gap-[19px]">
              <b className="relative text-3xl leading-[36px] flex text-gray items-center  h-6 shrink-0">
                  Announce prizes : only admin
                </b>
                <button onClick={() => {
  if (announceState === "Announce Winner") {
    getWinners();
  } else if (announceState === "Distribute Funds") {
    distributeFunds();
  }
}} className="text-lg px-8 py-4 bg-blue-300 border-cyan-800 border-4 rounded-2xl ml-6">{announceState}</button>
                {winnerList.length == 5 ? 
                <><b className="relative text-2xl leading-[36px] flex text-grey items-center  h-6 shrink-0">
                🏆🥇 {winnerList[0]}
               </b>
               <b className="relative text-2xl leading-[36px] flex text-gray items-center  h-6 shrink-0">
               🏆🥈 {winnerList[1]}
               </b>
               <b className="relative text-2xl leading-[36px] flex text-gray items-center  h-6 shrink-0">
               🏆🥉 {winnerList[2]}
               </b>
               <b className="relative text-2xl leading-[36px] flex text-gray items-center  h-6 shrink-0">
               🏆🏅 {winnerList[3]}
               </b>
               <b className="relative text-2xl leading-[36px] flex text-gray items-center  h-6 shrink-0">
               🏆🏅 {winnerList[4]}
               </b></> 
                : <></>}
                
                <b className="relative text-3xl leading-[36px] flex text-gray items-center w-[120.45px] h-6 shrink-0">
                  Past prizes
                </b>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[87px] h-3.5 shrink-0">
                    May 10, 2023
                  </div>
                  <b className="relative text-sm leading-[24px] flex text-darkgreen-100 items-center w-[34px] h-4 shrink-0">
                    $107
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[87px] h-3.5 shrink-0">
                    April 10, 2023
                  </div>
                  <b className="relative leading-[24px] flex text-darkgreen-100 items-center w-[17.97px] h-4 shrink-0">
                    $3
                  </b>
                </div>
                <div className="self-stretch rounded-8xs bg-whitesmoke flex flex-row py-4 px-3 items-center justify-between">
                  <div className="relative leading-[21px] flex items-center w-[87px] h-3.5 shrink-0">
                    April 10, 2023
                  </div>
                  <b className="relative leading-[24px] flex text-darkgreen-100 items-center w-[17.97px] h-4 shrink-0">
                    $3
                  </b>
                </div>
                
              </div>
            </div>
          </div>
          <div className="absolute top-[1079px] left-[calc(50%_-_718px)] w-[1440px] h-[47px] flex flex-row py-[17px] px-8 box-border items-center justify-between text-center text-black">
            <div className="relative w-[180.36px] h-[25px]">
              <div className="absolute top-[1px] left-[2px] leading-[21px]">{`Powered By `}</div>
              <div className="absolute top-[calc(50%_-_12.5px)] left-[78.38px] w-[25px] h-[25px] overflow-hidden">
                <img
                  className="absolute top-[6px] left-[4.62px] w-[13px] h-[13px] object-cover"
                  alt=""
                  src="/image-1@2x.png"
                />
              </div>
              <div className="absolute top-[1.5px] left-[98px] leading-[21px] font-semibold">
                Polygon
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[0px] left-[0px] bg-white w-[1440px] h-[77px] text-xl text-midnightblue">
          <div className="absolute w-full top-[16px] right-[0px] left-[0px] h-[45px]">
            <div className="absolute top-[calc(50%_-_22.5px)] left-[20px] w-[107.42px] h-[45px]">
              <img
                className="absolute top-[calc(50%_-_16.5px)] left-[22px] w-[30px] h-[34px] object-cover"
                alt=""
                src="/image-2@2x.png"
              />
              <div className="absolute top-[7px] left-[53px] leading-[36px] flex items-center w-[121px] h-8">
                Plant2Win
              </div>
              <div className="absolute top-[calc(50%_-_9.5px)] left-[1200px] w-[1px] h-[27px] bg-gray-200">
              <label style={{"backgroundColor" : "pink"}}>Dark Mode</label>
              <Switch
            checked={theme}
            color='primary'
            onChange={handleThemeChange} />

              </div>
            </div>
          </div>
          <div className="absolute top-[calc(50%_-_20.75px)] left-[calc(50%_+_248px)] ">
            {/* <b className="relative leading-[22.5px]">Connect</b> */}
            
          </div>
        </div>
      </div>
      </ThemeProvider>
    </div>
    </div>);
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getMoney()
  }, []);

  console.log("Total"+totalMoney)

  return (<>
  {!currentAccount && renderNotConnectedContainer()}
      {currentAccount && renderConnectedContainer()}
  </>
    
  );
};

export default Dashboard;
