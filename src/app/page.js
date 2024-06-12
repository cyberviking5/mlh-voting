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
        <div className="container mx-auto max-w-md mt-10 p-8 bg-gray-100 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Vote for Your Favorite Option</h1>
            <div className="flex justify-between mb-8">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg w-1/2 mr-4 transition duration-300"
                    onClick={() => castVote(1)}
                >
                    Option 1
                </button>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg w-1/2 ml-4 transition duration-300"
                    onClick={() => castVote(2)}
                >
                    Option 2
                </button>
            </div>
            <div className="flex justify-center mb-4">
                <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                    onClick={showResults}
                >
                    Show Results
                </button>
            </div>
            <div id="message" className="text-gray-800 mt-6 text-center text-lg">{message}</div>
        </div>
    );
}
