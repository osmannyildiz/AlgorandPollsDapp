import { Config } from '@algorandfoundation/algokit-utils'
import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/template/ErrorBoundary'
import './index.css'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

Config.configure({
  debug: true,
})

let supportedWallets: SupportedWallet[] = [
  { id: WalletId.LUTE },
  { id: WalletId.PERA },
  { id: WalletId.DEFLY },
  // If you are interested in WalletConnect v2 provider
  // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
    ...supportedWallets,
  ]
}

const algodConfig = getAlgodConfigFromViteEnvironment()

const walletManager = new WalletManager({
  wallets: supportedWallets,
  defaultNetwork: algodConfig.network,
  networks: {
    [algodConfig.network]: {
      algod: {
        baseServer: algodConfig.server,
        port: algodConfig.port,
        token: String(algodConfig.token),
      },
    },
  },
  options: {
    resetNetwork: true,
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <WalletProvider manager={walletManager}>
            <App />
          </WalletProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
