import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Wallet, TrendingUp, Eye, ExternalLink, AlertTriangle } from 'lucide-react'

// Mock portfolio data
const mockPortfolio = {
  totalValue: 15.75,
  totalNFTs: 12,
  collections: 4,
  ownedNFTs: [
    {
      id: 1,
      name: "Intuition Genesis #001",
      collection: "Intuition Genesis",
      image: "https://via.placeholder.com/200x200/6366f1/ffffff?text=001",
      mintPrice: 0.05,
      currentValue: 0.12,
      rarity: "Legendary"
    },
    {
      id: 2,
      name: "Trust Token #042",
      collection: "Trust Tokens",
      image: "https://via.placeholder.com/200x200/10b981/ffffff?text=042",
      mintPrice: 0.1,
      currentValue: 0.15,
      rarity: "Rare"
    },
    {
      id: 3,
      name: "Knowledge Keeper #156",
      collection: "Knowledge Keepers",
      image: "https://via.placeholder.com/200x200/f59e0b/ffffff?text=156",
      mintPrice: 0.02,
      currentValue: 0.03,
      rarity: "Common"
    },
    {
      id: 4,
      name: "Meme Lord #2847",
      collection: "Meme Lords",
      image: "https://via.placeholder.com/200x200/ef4444/ffffff?text=2847",
      mintPrice: 0.001,
      currentValue: 0.005,
      rarity: "Uncommon"
    }
  ],
  createdCollections: [
    {
      id: 1,
      name: "My First Collection",
      symbol: "MFC",
      totalSupply: 100,
      minted: 45,
      volume: 2.3,
      royalties: 0.15
    }
  ]
}

export default function Portfolio({ wallet }) {
  const [activeTab, setActiveTab] = useState('owned')

  if (!wallet.isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-foreground/40" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-foreground/60 mb-4">
                Connect your wallet to view your NFT portfolio and token holdings.
              </p>
              <Button onClick={wallet.connect} disabled={wallet.isLoading || !wallet.isMetaMaskInstalled}>
                {wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              
              {!wallet.isMetaMaskInstalled && (
                <Alert className="mt-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-orange-700 dark:text-orange-300">
                    MetaMask is required to view your portfolio.
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 underline font-semibold"
                    >
                      Install MetaMask
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-purple-500'
      case 'rare': return 'bg-blue-500'
      case 'uncommon': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
        <p className="text-foreground/80">
          Manage your NFT collections and track your holdings
        </p>
      </div>

      {/* Network Warning */}
      {!wallet.isOnIntuitionNetwork && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            Switch to Intuition Network to view your complete portfolio and interact with NFTs.
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total Value</p>
                <p className="text-2xl font-bold">{mockPortfolio.totalValue} tTRUST</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total NFTs</p>
                <p className="text-2xl font-bold">{mockPortfolio.totalNFTs}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Collections</p>
                <p className="text-2xl font-bold">{mockPortfolio.collections}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Account</p>
                <p className="text-sm font-mono">{wallet.formattedAddress}</p>
                <p className="text-xs text-foreground/60">{wallet.formattedBalance} tTRUST</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="owned">Owned NFTs</TabsTrigger>
          <TabsTrigger value="created">Created Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="owned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockPortfolio.ownedNFTs.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{nft.name}</CardTitle>
                  <CardDescription>{nft.collection}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Mint Price:</span>
                      <span>{nft.mintPrice} tTRUST</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Current Value:</span>
                      <span className="font-semibold">{nft.currentValue} tTRUST</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">P&L:</span>
                      <span className={`font-semibold ${
                        nft.currentValue > nft.mintPrice ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {nft.currentValue > nft.mintPrice ? '+' : ''}
                        {((nft.currentValue - nft.mintPrice) / nft.mintPrice * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={!wallet.isOnIntuitionNetwork}
                    >
                      List for Sale
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="created" className="mt-6">
          <div className="space-y-4">
            {mockPortfolio.createdCollections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{collection.name}</CardTitle>
                      <CardDescription>Symbol: {collection.symbol}</CardDescription>
                    </div>
                    <Badge variant="outline">Creator</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Total Supply</p>
                      <p className="text-lg font-semibold">{collection.totalSupply}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Minted</p>
                      <p className="text-lg font-semibold">{collection.minted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Volume</p>
                      <p className="text-lg font-semibold">{collection.volume} tTRUST</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Royalties Earned</p>
                      <p className="text-lg font-semibold text-green-500">{collection.royalties} tTRUST</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Minting Progress</span>
                      <span>{((collection.minted / collection.totalSupply) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(collection.minted / collection.totalSupply) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!wallet.isOnIntuitionNetwork}
                    >
                      View Collection
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!wallet.isOnIntuitionNetwork}
                    >
                      Manage Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

