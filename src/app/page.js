"use client"
import { useState } from 'react';
import {address,abi} from '../../abi-address/voting'
import {ethers} from 'ethers'

export default function Home() {
    const [message, setMessage] = useState("");
    function listenForTransactionMined(transactionResponse, provider) {
        try {
            console.log(`Mining ${transactionResponse.hash}...`);
            //listen for this transaction to be finished
            return new Promise((resolve, reject) => {
                provider.once(transactionResponse.hash, (transactionReciept) => {
                    console.log(`Completed with ${transactionReciept.confirmations}`);
                    resolve();
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
    
    const castVote = async (option) => {
        try {
            if (window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(address, abi, signer);
                const transactionResponse = await contract.vote(option);
                await listenForTransactionMined(transactionResponse, provider);
                setMessage(`Vote cast successfully for ${option}`);
            } 
        } catch (error) {
            console.error(error);
            setMessage('Failed to cast vote. Please try again.');
        }
    };

    const showResults = async () => {
        try {
            if (window.ethereum !== "undefined") {
                console.log(address)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(address, abi, signer);
                const transactionResponse = await contract.getWinningOption();
                console.log(transactionResponse)
                setMessage(`${transactionResponse} is winning`);
            } 
        } catch (error) {
            console.error(error);
            setMessage('Failed to fetch results. Please try again.');
        }
    };

    return (
        <div className="container mx-auto max-w-md mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Vote for Your Favorite Option</h1>
            <div className="flex justify-between mb-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 mr-2" onClick={() => castVote(1)}>Option 1</button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 ml-2" onClick={() => castVote(2)}>Option 2</button>
            </div>
            <div className="flex justify-center">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={showResults}>Show Results</button>
            </div>
            <div id="message" className="text-red-500 mt-4 text-center">{message}</div>
        </div>
    );
}
