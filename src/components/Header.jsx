import { Button } from '@/components/ui/button.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Wallet, Eye, AlertTriangle } from 'lucide-react'

export default function Header({ wallet, onNavigate }) {
  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Eye className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Intuition NFT
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('create')}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Create
            </button>
            <button 
              onClick={() => onNavigate('explore')}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Explore
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Portfolio
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {wallet.isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-foreground/80">
                  {wallet.formattedAddress}
                </div>
                <div className="text-sm text-foreground/60">
                  {wallet.formattedBalance} tTRUST
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ) : (
              <Button 
                onClick={wallet.connect} 
                disabled={wallet.isLoading || !wallet.isMetaMaskInstalled}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>
                  {wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {wallet.error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {wallet.error}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

