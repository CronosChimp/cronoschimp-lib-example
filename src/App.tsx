import React, { useState } from 'react';
import Chimps from './Chimps';

declare global {
  interface Window { ethereum: any; }
}

function App() {
  const [account, setAccount] = useState('');

  const handleConnect = () => {
    if ( window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
        setAccount(accounts[0]);
      });
    } else {
      alert('Metamask is installed?')
    }
  }

  return (
    <div className="App">
      <button onClick={handleConnect}>Connect Wallet</button>
      {account && (
        <div>
          <div>Connected to: {account}</div>
          <Chimps account={account} />
        </div>
      )}
    </div>
  );
}

export default App;
