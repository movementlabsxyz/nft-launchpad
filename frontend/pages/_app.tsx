import { SessionProvider } from "next-auth/react"
import "./styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";


import { 
  AptosWalletAdapterProvider,
  NetworkName
} from "@aptos-labs/wallet-adapter-react";
import { toast } from "react-toastify";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {

  const wallets: any = [
    new PetraWallet(),
    new PontemWallet(),
    new RiseWallet(),
    new TokenPocketWallet(),
    new TrustWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new BloctoWallet({
      network: 'testnet' as any,
      bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
    }),
  ];

  return (
    <SessionProvider session={session}>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        onError={(error: any) => {
          toast.error(error);
        }}
      >
        <Component {...pageProps} />
      </AptosWalletAdapterProvider>
    </SessionProvider>
  )
}
