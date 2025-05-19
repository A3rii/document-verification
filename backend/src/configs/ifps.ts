import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { bootstrap } from "@libp2p/bootstrap";
import { kadDHT } from "@libp2p/kad-dht";
import { ping } from "@libp2p/ping";
import { identify } from "@libp2p/identify";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const connectIPFS = async () => {
  const libp2p = await createLibp2p({
    transports: [webSockets()],
    peerDiscovery: [
      bootstrap({
        list: [process.env.KUBO_PEER_ID as string],
      }),
    ],
    services: {
      dht: kadDHT(),
      ping: ping(),
      identify: identify(),
    },
  });

  const helia = await createHelia({ libp2p });
  const fs = unixfs(helia);

  console.log(" Helia connected to local IPFS node");

  return { helia, fs };
};

export default connectIPFS;
