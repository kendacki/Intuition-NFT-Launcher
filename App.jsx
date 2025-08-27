import { useState } from 'react'
import { useWallet } from './hooks/useWallet.js'
import Header from './components/Header.jsx'
import CreateNFT from './components/CreateNFT.jsx'
import ExploreNFTs from './components/ExploreNFTs.jsx'
import Portfolio from './components/Portfolio.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Eye, Rocket, Coins, Users, AlertTriangle, Download } from 'lucide-react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const wallet = useWallet()

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateNFT wallet={wallet} />
      case 'explore':
        return <ExploreNFTs wallet={wallet} />
      case 'portfolio':
        return <Portfolio wallet={wallet} />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* MetaMask Installation Alert */}
      {!wallet.isMetaMaskInstalled && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              MetaMask is required to use this application. 
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 underline font-semibold hover:text-orange-800 dark:hover:text-orange-200"
              >
                Install MetaMask
              </a>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Network Warning */}
      {wallet.isConnected && !wallet.isOnIntuitionNetwork && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              Please switch to Intuition Network to use all features. The app will attempt to switch networks when you connect.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Eye className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Intuition NFT
            </h1>
          </div>
          <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
            Create, launch, and trade NFTs on the Intuition Network. 
            The first NFT platform powered by the world's token-curated knowledge graph.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentPage('create')}
              className="flex items-center space-x-2"
              disabled={!wallet.isMetaMaskInstalled}
            >
              <Rocket className="h-5 w-5" />
              <span>Launch Your NFT</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentPage('explore')}
              className="flex items-center space-x-2"
            >
              <Eye className="h-5 w-5" />
              <span>Explore Collections</span>
            </Button>
          </div>
          
          {!wallet.isMetaMaskInstalled && (
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                className="flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Install MetaMask</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Intuition NFT?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Coins className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Low Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create NFT collections for just 0.1 tTRUST. No hidden fees, transparent pricing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Trust Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built on Intuition's trust protocol, ensuring authenticity and provenance of all NFTs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fair launch mechanics with bonding curves. No presales, pure community-driven price discovery.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">4</div>
            <div className="text-foreground/60">NFT Collections</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-500 mb-2">5,650</div>
            <div className="text-foreground/60">NFTs Minted</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">51.7</div>
            <div className="text-foreground/60">Volume (tTRUST)</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">4</div>
            <div className="text-foreground/60">Active Collections</div>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Built on Intuition Network</CardTitle>
            <CardDescription>
              The native chain for knowledge and information finance
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold">3.5M</div>
                <div className="text-sm text-foreground/60">Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">396K</div>
                <div className="text-sm text-foreground/60">Active Accounts</div>
              </div>
            </div>
            <p className="text-sm text-foreground/60">
              Powered by $TRUST token and secured by the world's first token-curated knowledge graph
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header 
        wallet={wallet}
        onNavigate={setCurrentPage}
      />
      {renderPage()}
    </div>
  )
}

export default App
