import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "0d3d009c508ededd57b8b325277f8937";

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
  },
});
