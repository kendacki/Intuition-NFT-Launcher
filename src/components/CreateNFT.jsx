import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Upload, Image as ImageIcon, Coins, AlertTriangle } from 'lucide-react'
import { createNFTCollection } from '../lib/web3.js'

export default function CreateNFT({ wallet }) {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    image: null,
    supply: 1000,
    price: 0.01
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!wallet.isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!wallet.isOnIntuitionNetwork) {
      setError('Please switch to Intuition Network to create NFT collections')
      return
    }

    setIsCreating(true)
    try {
      const result = await createNFTCollection(formData)
      
      // Refresh balance after successful creation
      await wallet.refreshBalance()
      
      alert(`NFT Collection created successfully! Transaction: ${result.transactionHash}`)
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        description: '',
        image: null,
        supply: 1000,
        price: 0.01
      })
      setImagePreview(null)
    } catch (error) {
      setError('Error creating NFT: ' + error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const creationCost = 0.1
  const hasEnoughBalance = wallet.balance >= creationCost

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Create Your NFT Collection</h2>
          <p className="text-foreground/80">
            Launch your NFT collection on Intuition Network with bonding curve mechanics
          </p>
        </div>

        {/* Wallet Connection Alert */}
        {!wallet.isConnected && (
          <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Connect your wallet to create NFT collections on Intuition Network.
            </AlertDescription>
          </Alert>
        )}

        {/* Network Alert */}
        {wallet.isConnected && !wallet.isOnIntuitionNetwork && (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              Please switch to Intuition Network to create NFT collections.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-green-500" />
                <span>Creation Cost</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{creationCost} tTRUST</div>
              <p className="text-sm text-foreground/60">One-time fee for NFT collection creation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallet.formattedBalance} tTRUST</div>
              {wallet.isConnected && !hasEnoughBalance && (
                <p className="text-sm text-destructive mt-2">
                  Insufficient balance. You need at least {creationCost} tTRUST
                </p>
              )}
              {!wallet.isConnected && (
                <p className="text-sm text-foreground/60 mt-2">
                  Connect wallet to view balance
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Collection Information</CardTitle>
            <CardDescription>
              Provide details about your NFT collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Intuition Apes"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    placeholder="e.g., IAPES"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your NFT collection..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supply">Total Supply</Label>
                  <Input
                    id="supply"
                    name="supply"
                    type="number"
                    min="1"
                    value={formData.supply}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Mint Price (tTRUST)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Collection Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {imagePreview ? (
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg mb-4"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image').click()}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-foreground/40 mb-4" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image').click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                      </Button>
                      <p className="text-sm text-foreground/60 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Your NFT collection will be deployed on Intuition Network</li>
                  <li>• Collection metadata will be stored on IPFS</li>
                  <li>• Bonding curve will be created for price discovery</li>
                  <li>• Users can mint NFTs at the specified price</li>
                  <li>• You earn royalties from secondary sales</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!wallet.isConnected || !wallet.isOnIntuitionNetwork || !hasEnoughBalance || isCreating}
              >
                {isCreating ? 'Creating Collection...' : 'Create NFT Collection'}
              </Button>

              {!wallet.isConnected && (
                <p className="text-center text-sm text-foreground/60">
                  Connect your wallet to create an NFT collection
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

