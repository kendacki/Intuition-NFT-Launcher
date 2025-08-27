import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { TrendingUp, Flame, Clock, AlertTriangle } from 'lucide-react'
import { mintNFT } from '../lib/web3.js'

// Mock NFT collections data
const mockCollections = [
  {
    id: 1,
    name: "Intuition Genesis",
    symbol: "IGEN",
    image: "https://via.placeholder.com/300x300/6366f1/ffffff?text=Genesis",
    description: "The first NFT collection on Intuition Network",
    creator: "0x1234...5678",
    totalSupply: 1000,
    minted: 750,
    mintPrice: 0.05,
    volume: 12.5,
    trending: true,
    active: true
  },
  {
    id: 2,
    name: "Trust Tokens",
    symbol: "TRUST",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Trust",
    description: "Collectible tokens representing trust in the network",
    creator: "0xabcd...efgh",
    totalSupply: 500,
    minted: 200,
    mintPrice: 0.1,
    volume: 8.3,
    trending: false,
    active: true
  },
  {
    id: 3,
    name: "Knowledge Keepers",
    symbol: "KNOW",
    image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Knowledge",
    description: "NFTs for knowledge contributors and curators",
    creator: "0x9876...5432",
    totalSupply: 2000,
    minted: 1500,
    mintPrice: 0.02,
    volume: 25.7,
    trending: true,
    active: true
  },
  {
    id: 4,
    name: "Meme Lords",
    symbol: "MEME",
    image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Meme",
    description: "The dankest memes on Intuition Network",
    creator: "0x1111...2222",
    totalSupply: 10000,
    minted: 8500,
    mintPrice: 0.001,
    volume: 15.2,
    trending: false,
    active: false
  }
]

export default function ExploreNFTs({ wallet }) {
  const [activeTab, setActiveTab] = useState('all')
  const [mintingStates, setMintingStates] = useState({})

  const handleMint = async (collection) => {
    if (!wallet.isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!wallet.isOnIntuitionNetwork) {
      alert('Please switch to Intuition Network to mint NFTs')
      return
    }

    if (wallet.balance < collection.mintPrice) {
      alert(`Insufficient balance. You need ${collection.mintPrice} tTRUST to mint this NFT.`)
      return
    }

    setMintingStates(prev => ({ ...prev, [collection.id]: true }))

    try {
      const tokenId = collection.minted + 1
      const result = await mintNFT(collection.contractAddress, tokenId)
      
      // Refresh balance after successful mint
      await wallet.refreshBalance()
      
      alert(`NFT minted successfully! Token ID: ${tokenId}, Transaction: ${result.transactionHash}`)
    } catch (error) {
      alert('Error minting NFT: ' + error.message)
    } finally {
      setMintingStates(prev => ({ ...prev, [collection.id]: false }))
    }
  }

  const filteredCollections = mockCollections.filter(collection => {
    switch (activeTab) {
      case 'active':
        return collection.active
      case 'trending':
        return collection.trending
      default:
        return true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Explore NFT Collections</h2>
        <p className="text-foreground/80">
          Discover and collect unique NFTs on the Intuition Network
        </p>
      </div>

      {/* Network Warning */}
      {wallet.isConnected && !wallet.isOnIntuitionNetwork && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            Switch to Intuition Network to mint NFTs and interact with collections.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{mockCollections.length}</div>
            <div className="text-sm text-foreground/60">Collections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {mockCollections.reduce((sum, col) => sum + col.minted, 0)}
            </div>
            <div className="text-sm text-foreground/60">NFTs Minted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {mockCollections.reduce((sum, col) => sum + col.volume, 0).toFixed(1)}
            </div>
            <div className="text-sm text-foreground/60">Volume (tTRUST)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {mockCollections.filter(col => col.active).length}
            </div>
            <div className="text-sm text-foreground/60">Active Collections</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Active</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <Flame className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-48 object-cover"
              />
              {collection.trending && (
                <Badge className="absolute top-2 left-2 bg-orange-500">
                  <Flame className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {collection.active && (
                <Badge className="absolute top-2 right-2 bg-green-500">
                  Active
                </Badge>
              )}
            </div>

            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{collection.name}</CardTitle>
                <Badge variant="outline">{collection.symbol}</Badge>
              </div>
              <CardDescription>{collection.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Creator:</span>
                  <span className="font-mono">{collection.creator}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Minted:</span>
                  <span>{collection.minted} / {collection.totalSupply}</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(collection.minted / collection.totalSupply) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-foreground/60">Mint Price:</span>
                    <div className="font-semibold">{collection.mintPrice} tTRUST</div>
                  </div>
                  <div>
                    <span className="text-foreground/60">Volume:</span>
                    <div className="font-semibold">{collection.volume} tTRUST</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleMint(collection)}
                    disabled={
                      !wallet.isConnected || 
                      !wallet.isOnIntuitionNetwork || 
                      !collection.active || 
                      collection.minted >= collection.totalSupply ||
                      wallet.balance < collection.mintPrice ||
                      mintingStates[collection.id]
                    }
                  >
                    {mintingStates[collection.id] ? (
                      'Minting...'
                    ) : collection.minted >= collection.totalSupply ? (
                      'Sold Out'
                    ) : !collection.active ? (
                      'Inactive'
                    ) : (
                      `Mint NFT`
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>

                {!wallet.isConnected && (
                  <p className="text-xs text-center text-foreground/60 mt-2">
                    Connect wallet to mint NFTs
                  </p>
                )}

                {wallet.isConnected && wallet.balance < collection.mintPrice && (
                  <p className="text-xs text-center text-destructive mt-2">
                    Insufficient balance ({wallet.formattedBalance} tTRUST)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">No collections found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}

