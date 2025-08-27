import { useState, useEffect, useCallback } from 'react'
import {
  connectWallet,
  getBalance,
  onAccountsChanged,
  onChainChanged,
  removeListeners,
  isMetaMaskInstalled,
  formatAddress,
  formatBalance,
  INTUITION_NETWORK
} from '../lib/web3.js'

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [chainId, setChainId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
          setChainId(currentChainId)
          
          const accountBalance = await getBalance(accounts[0])
          setBalance(accountBalance)
        }
      } catch (error) {
        console.error('Failed to check connection:', error)
      }
    }

    checkConnection()
  }, [])

  // Set up event listeners
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setIsConnected(false)
        setAccount(null)
        setBalance(0)
        setChainId(null)
      } else {
        // User switched accounts
        setAccount(accounts[0])
        setIsConnected(true)
        // Refresh balance for new account
        getBalance(accounts[0]).then(setBalance).catch(console.error)
      }
    }

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId)
      // Refresh balance when chain changes
      if (account) {
        getBalance(account).then(setBalance).catch(console.error)
      }
    }

    onAccountsChanged(handleAccountsChanged)
    onChainChanged(handleChainChanged)

    return () => {
      removeListeners()
    }
  }, [account])

  const connect = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { account: connectedAccount, chainId: connectedChainId } = await connectWallet()
      
      setAccount(connectedAccount)
      setChainId(connectedChainId)
      setIsConnected(true)

      // Get balance
      const accountBalance = await getBalance(connectedAccount)
      setBalance(accountBalance)

    } catch (error) {
      setError(error.message)
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAccount(null)
    setBalance(0)
    setChainId(null)
    setError(null)
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!account) return

    try {
      const accountBalance = await getBalance(account)
      setBalance(accountBalance)
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    }
  }, [account])

  // Check if connected to Intuition Network
  const isOnIntuitionNetwork = chainId === INTUITION_NETWORK.chainId

  return {
    // State
    isConnected,
    account,
    balance,
    chainId,
    isLoading,
    error,
    isOnIntuitionNetwork,
    
    // Actions
    connect,
    disconnect,
    refreshBalance,
    
    // Utilities
    formattedAddress: formatAddress(account),
    formattedBalance: formatBalance(balance),
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
}

