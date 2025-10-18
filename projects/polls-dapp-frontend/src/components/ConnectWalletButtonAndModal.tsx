import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { useCallback, useMemo, useState } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import Account from './template/Account'

const ConnectWalletButtonAndModal = () => {
  const { wallets, activeAddress } = useWallet()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const algoConfig = getAlgodConfigFromViteEnvironment()

  const networkName = useMemo(() => {
    return algoConfig.network === '' ? 'Localnet' : algoConfig.network
  }, [algoConfig.network])

  const disconnectWallet = useCallback(() => {
    ;(async () => {
      if (wallets) {
        const activeWallet = wallets.find((w) => w.isActive)
        if (activeWallet) {
          await activeWallet.disconnect()
        } else {
          // Required for logout/cleanup of inactive providers
          // For instance, when you login to localnet wallet and switch network
          // to testnet/mainnet or vice verse.
          localStorage.removeItem('@txnlab/use-wallet:v3')
          window.location.reload()
        }
      }
    })()
  }, [wallets])

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        {activeAddress ? `${ellipseAddress(activeAddress)} - ${networkName}` : 'Connect Wallet'}
      </button>

      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex items-center justify-center"
        style={{ display: isModalOpen ? 'flex' : 'none' }}
      >
        <div className="bg-white p-4 rounded-lg">
          {activeAddress ? (
            <>
              <h3 className="font-bold text-2xl">Connected wallet</h3>
              <Account />
              <button
                type="button"
                className="block w-full"
                onClick={async () => {
                  await disconnectWallet()
                  setIsModalOpen(false)
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <h3 className="font-bold text-2xl">Select wallet provider</h3>
              <div className="grid m-2 pt-5">
                {wallets?.map((wallet) => (
                  <button
                    key={`provider-${wallet.id}`}
                    type="button"
                    className="flex gap-2 items-center bg-gray-200 m-2 p-2 rounded-md"
                    onClick={async () => {
                      await wallet.connect()
                      setIsModalOpen(false)
                    }}
                  >
                    {!isKmd(wallet) && (
                      <img
                        alt={`wallet_icon_${wallet.id}`}
                        src={wallet.metadata.icon}
                        style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                      />
                    )}
                    <span>{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            type="button"
            className="block w-full"
            onClick={() => {
              setIsModalOpen(false)
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default ConnectWalletButtonAndModal
