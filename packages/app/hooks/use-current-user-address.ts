import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { useAccount } from "wagmi";

import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";

/**
 * To avoid address collision this hook will maintain the active address.
 * In the unexpected event of multiple active providers the preference order for address
 * selection will be 1st wallet connect 2nd magic then if provided the first address in `profile.wallet_addresses_v2`
 */
function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const { web3 } = useWeb3();
  const connector = useWalletConnect();
  const { data: wagmiData } = useAccount();
  const connectedAddress = connector?.session?.accounts[0];

  useEffect(() => {
    if (connector?.connected && connectedAddress) {
      setUserAddress(connectedAddress);
    } else if (wagmiData) {
      setUserAddress(wagmiData.address);
    } else if (Platform.OS !== "web" && web3) {
      const signer = web3.getSigner();
      signer
        .getAddress()
        .then((addr: string) => {
          setUserAddress(addr);
        })
        .catch(() => {
          // TODO: temporary hack to make magic test email work with current auth APIs
          if (
            user?.data.profile.wallet_addresses_v2.find(
              (c) =>
                c.email.toLowerCase() ===
                BYPASS_EMAIL_WITH_INSECURE_KEYS.toLowerCase()
            )
          ) {
            setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
          }
        });
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      setUserAddress("");
    }
  }, [user, web3, connectedAddress, connector?.connected, wagmiData]);

  return { userAddress };
}

export { useCurrentUserAddress };
