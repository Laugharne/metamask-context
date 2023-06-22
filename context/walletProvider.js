"use client";

import React, { useState, useEffect} from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

const WalletContext = React.createContext(null);

export const WalletProvider = ({ children })=> {
	// state
	const [account, setAccount]   = useState(null);
	const [provider, setProvider] = useState(null);
	const [chainId, setChainId]   = useState(null);

	let currentAccount = null;

	// events METAMASK
	// ---------------

	useEffect(() => {
		ethereum.on('accountsChanged', handleAccountsChanged);
		ethereum.on('chainChanged',    handleChainChanged);

		return ()=> {
			ethereum.removeListener('accountsChanged', handleAccountsChanged);
			ethereum.removeListener('chainChanged',    handlechainChanged);
		}
	}, []);

	// Connexion function
	const connect = async ()=> {
		const provider = await detectEthereumProvider();

		if( provider) {
			startApp( provider);
			const chainId = await ethereum.request({ method: 'eth_chainId'});
			// Connected on Hardhat ?
			console.log(chainId.toString());
			if( chainId.toString() == "0x7a69") {
				ethereum.request({ method: "eth_requestAccounts"})
					.then( handleAccountsChanged)
					.catch((err)=> {
						// l'erreur 4001 provient du fait que l'utilisateur cancel
						// la demande de connexion à Metamask lorsque la popu Metamask
						// de connexion à un compte se lance
						if( err.code === 4001) {
							console.log("Please connec to METAMASK");
							alert("Please connec to METAMASK");
						} else {
							// Sinon c'est une autre erreur inconnue que l'on veut connaitre avec le console.log
							console.log(err);
						}
				});
			} else {
				console.log("Please, change your network on METAMASK, you need to be connected to Goerli Test network");
				alert("Please, change your network on METAMASK, you need to be connected to Goerli Test network");
			}

		} else {
			console.log("Please, install METAMASK");
			alert("Please, install METAMASK");
		}
	};


	const startApp = (provider)=> {
		if( provider !== window.erthereum) {
			console.error("Do you have multiple Wallets installed ?");
		}
	}
	
	
	const handleAccountsChanged = (accounts)=> {
		if( accounts.length === 0) {
			console.log("Please connect to METAMASK");
			alert("Please connect to METAMASK");
			setAccount(null);
			setProvider( null );
			setChainId(null);
			console.log("disconnected");
			alert("disconnected");
		} else if(accounts[0] !== currentAccount) {
			currentAccount = accounts[0];
			console.log(currentAccount);
			alert(currentAccount);
			setAccount(currentAccount);
			setProvider( new ethers.providers.Web3Provider(window.ethereum));
		}
	}
	
	
	const handleChainChanged = ()=> {
		window.location.reload();
	}


	return(
		<WalletContext.Provider value={{
			account,
			provider,
			setAccount,
			chainId,
			connect
		}}
		>
			{children}
		</WalletContext.Provider>
	);
};




export default WalletContext;