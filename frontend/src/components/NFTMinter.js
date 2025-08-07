'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import toast from 'react-hot-toast';

export default function NFTMinter() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mintData, setMintData] = useState({
    name: '',
    description: '',
    file: null
  });

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(contractInstance);
        
        loadUserNFTs(contractInstance, address);
        toast.success('Wallet connected!');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask!');
    }
  };

  // Load user's NFTs
const loadUserNFTs = async (contractInstance, address) => {
  try {
    setLoading(true);
    console.log('=== LOADING USER NFTS ===');
    console.log('Contract:', contractInstance);
    console.log('Address:', address);
    
    const tokenIds = await contractInstance.getTokensByOwner(address);
    console.log('Token IDs:', tokenIds);
    
    const nfts = [];
    
    for (let tokenId of tokenIds) {
      try {
        const tokenURI = await contractInstance.tokenURI(tokenId);
        console.log(`Token ${tokenId} URI:`, tokenURI);
        
        // Convert IPFS URL to HTTP gateway URL if needed
        let fetchURL = tokenURI;
        if (tokenURI.startsWith('ipfs://')) {
          fetchURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        console.log(`Fetching metadata from: ${fetchURL}`);
        
        const response = await fetch(fetchURL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const metadata = await response.json();
        console.log(`Token ${tokenId} metadata:`, metadata);
        
        // Convert image IPFS URL to HTTP gateway URL if needed
        let imageUrl = metadata.image;
        if (imageUrl && imageUrl.startsWith('ipfs://')) {
          imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }
        
        nfts.push({
          tokenId: tokenId.toString(),
          ...metadata,
          image: imageUrl
        });
      } catch (error) {
        console.error(`Error loading token ${tokenId}:`, error);
        // Add the NFT with basic info even if metadata fails
        nfts.push({
          tokenId: tokenId.toString(),
          name: `NFT #${tokenId}`,
          description: 'Metadata could not be loaded',
          image: '/placeholder-image.png' // Add a placeholder image
        });
      }
    }
    
    console.log('Final NFTs array:', nfts);
    setOwnedNFTs(nfts);
  } catch (error) {
    console.error('Error loading NFTs:', error);
    toast.error('Failed to load NFTs');
  } finally {
    setLoading(false);
  }  
  };

  // Upload to IPFS and mint NFT
  const mintNFT = async () => {
    if (!contract || !mintData.name || !mintData.description || !mintData.file) {
      toast.error('Please fill all fields and select an image');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Uploading to IPFS...');

      // Upload to IPFS via API route
      const formData = new FormData();
      formData.append('file', mintData.file);
      formData.append('name', mintData.name);
      formData.append('description', mintData.description);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error('Failed to upload to IPFS');
      }

      toast.dismiss();
      toast.loading('Minting NFT...');

      // Mint NFT
      const mintPrice = await contract.mintPrice();
      const tx = await contract.mintNFT(account, uploadResult.metadataUrl, {
        value: mintPrice
      });

      await tx.wait();
      
      toast.dismiss();
      toast.success('NFT minted successfully!');
      
      // Reset form and reload NFTs
      setMintData({ name: '', description: '', file: null });
      await loadUserNFTs(contract, account);

    } catch (error) {
      toast.dismiss();
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">NFT Minting dApp</h1>
      
      {/* Connect Wallet */}
      <div className="text-center mb-8">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="text-lg mb-4">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        )}
      </div>

      {account && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mint Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Mint New NFT</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={mintData.name}
                  onChange={(e) => setMintData(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter NFT name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={mintData.description}
                  onChange={(e) => setMintData(prev => ({...prev, description: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                  placeholder="Enter NFT description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMintData(prev => ({...prev, file: e.target.files[0]}))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {mintData.file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {mintData.file.name}
                  </p>
                )}
              </div>
              
              <button
                onClick={mintNFT}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Mint NFT (0.01 ETH)'}
              </button>
            </div>
          </div>

          {/* NFT Gallery */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Your NFTs ({ownedNFTs.length})</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading NFTs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ownedNFTs.map((nft) => (
                  <div key={nft.tokenId} className="border rounded-lg overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{nft.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{nft.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Token ID: {nft.tokenId}</p>
                    </div>
                  </div>
                ))}
                
                {ownedNFTs.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>No NFTs found. Mint your first NFT!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}