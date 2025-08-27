// Intuition Network configuration
export const INTUITION_NETWORK = {
  chainId: '0x1234', // Placeholder - actual chain ID would be provided by Intuition team
  chainName: 'Intuition Network',
  nativeCurrency: {
    name: 'tTRUST',
    symbol: 'tTRUST',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.intuition.systems'], // Placeholder RPC URL
  blockExplorerUrls: ['https://explorer.intuition.systems'],
}

// Contract addresses (placeholders - would be actual deployed contracts)
export const CONTRACTS = {
  NFT_FACTORY: '0x1234567890123456789012345678901234567890',
  TRUST_TOKEN: '0x0987654321098765432109876543210987654321',
  MARKETPLACE: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

// Add Intuition Network to MetaMask
export const addIntuitionNetwork = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [INTUITION_NETWORK],
    })
    return true
  } catch (error) {
    console.error('Failed to add Intuition Network:', error)
    throw error
  }
}

// Switch to Intuition Network
export const switchToIntuitionNetwork = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: INTUITION_NETWORK.chainId }],
    })
    return true
  } catch (error) {
    // If the network doesn't exist, add it
    if (error.code === 4902) {
      return await addIntuitionNetwork()
    }
    console.error('Failed to switch to Intuition Network:', error)
    throw error
  }
}

// Connect to MetaMask
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    if (accounts.length === 0) {
      throw new Error('No accounts found')
    }

    // Switch to Intuition Network
    await switchToIntuitionNetwork()

    return {
      account: accounts[0],
      chainId: await window.ethereum.request({ method: 'eth_chainId' }),
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    throw error
  }
}

// Get account balance
export const getBalance = async (account) => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    })

    // Convert from wei to ether
    return parseInt(balance, 16) / Math.pow(10, 18)
  } catch (error) {
    console.error('Failed to get balance:', error)
    return 0
  }
}

// Listen for account changes
export const onAccountsChanged = (callback) => {
  if (!isMetaMaskInstalled()) return

  window.ethereum.on('accountsChanged', callback)
}

// Listen for chain changes
export const onChainChanged = (callback) => {
  if (!isMetaMaskInstalled()) return

  window.ethereum.on('chainChanged', callback)
}

// Remove event listeners
export const removeListeners = () => {
  if (!isMetaMaskInstalled()) return

  window.ethereum.removeAllListeners('accountsChanged')
  window.ethereum.removeAllListeners('chainChanged')
}

// Mock NFT creation function (would interact with actual smart contracts)
export const createNFTCollection = async (collectionData) => {
  // Simulate transaction
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        resolve({
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
          blockNumber: Math.floor(Math.random() * 1000000),
        })
      } else {
        reject(new Error('Transaction failed'))
      }
    }, 2000)
  })
}

// Mock NFT minting function
export const mintNFT = async (contractAddress, tokenId) => {
  // Simulate transaction
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) { // 95% success rate
        resolve({
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          tokenId: tokenId,
          blockNumber: Math.floor(Math.random() * 1000000),
        })
      } else {
        reject(new Error('Minting failed'))
      }
    }, 1500)
  })
}

// Format address for display
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Format balance for display
export const formatBalance = (balance) => {
  if (typeof balance !== 'number') return '0.00'
  return balance.toFixed(4)
}

