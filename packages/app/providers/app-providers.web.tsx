import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";
import { ToastProvider } from "@showtime-xyz/universal.toast";

import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { BiconomyProvider } from "app/providers/biconomy-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MagicProvider } from "app/providers/magic-provider.web";
import { MuteProvider } from "app/providers/mute-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { LightBoxProvider } from "design-system/light-box";

import { RudderStackProvider } from "./rudderstack-provider.web";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <RudderStackProvider>
      <MagicProvider>
        <ColorSchemeProvider>
          <SafeAreaProvider>
            <ToastProvider>
              <LightBoxProvider>
                <WalletProvider>
                  <AlertProvider>
                    <SnackbarProvider>
                      <SWRProvider>
                        <Web3Provider>
                          <AuthProvider>
                            <UserProvider>
                              <BottomSheetModalProvider>
                                <GrowthBookProvider growthbook={growthbook}>
                                  <FeedProvider>
                                    <NavigationProvider>
                                      <BiconomyProvider>
                                        <MuteProvider>{children}</MuteProvider>
                                      </BiconomyProvider>
                                    </NavigationProvider>
                                  </FeedProvider>
                                </GrowthBookProvider>
                              </BottomSheetModalProvider>
                            </UserProvider>
                          </AuthProvider>
                        </Web3Provider>
                      </SWRProvider>
                    </SnackbarProvider>
                  </AlertProvider>
                </WalletProvider>
              </LightBoxProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </ColorSchemeProvider>
      </MagicProvider>
    </RudderStackProvider>
  );
};
