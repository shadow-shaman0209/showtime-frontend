import { Platform } from "react-native";
import useUnmountSignal from "use-unmount-signal";
import useSWR from "swr";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Button, ScrollView } from "design-system";
import { Media } from "design-system/media";
import { createParam } from "app/navigation/use-param";
import { axios } from "app/lib/axios";
import { Close } from "design-system/icon";
import { useRouter } from "app/navigation/use-router";
import { tw } from "design-system/tailwind";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Social } from "design-system/card/social";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";
import { Description } from "design-system/card/rows/description";
// import { Comments } from "design-system/comments";
import type { NFT } from "app/types";
import { NFTDropdown } from "app/components/nft-dropdown";
import { Owner } from "design-system/card/rows/owner";
import { LikedBy } from "design-system/liked-by";
import { NFT_DETAIL_API } from "app/utilities";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

function NftScreen() {
  const { top: topSafeArea } = useSafeAreaInsets();
  const router = useRouter();
  const unmountSignal = useUnmountSignal();
  const [nftId, setNftId] = useParam("id");
  const { data, error } = useSWR<{ data: NFT }>(
    `${NFT_DETAIL_API}/${nftId}`,
    (url) => axios({ url, method: "GET", unmountSignal })
  );
  const nft = data?.data;

  if (error) {
    console.error(error);
  }

  return (
    <View
      tw={[
        "flex-1 bg-gray-200 dark:bg-black",
        Platform.OS === "web" || Platform.OS === "android"
          ? `pt-[${topSafeArea}px]`
          : "",
      ]}
    >
      <View tw="p-4 h-16 flex-row items-center justify-between">
        <Button
          onPress={router.pop}
          variant="tertiary"
          iconOnly={true}
          size="regular"
        >
          <Close
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
        <NFTDropdown nft={nft} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        <PinchToZoom>
          <Media item={nft} numColumns={1} />
        </PinchToZoom>

        <Collection nft={nft} />

        <Social nft={nft} />

        <LikedBy nft={nft} />

        <Title nft={nft} />

        <Description nft={nft} />

        <Owner nft={nft} price={true} />
      </ScrollView>

      {/* <Suspense fallback={<Spinner />}>
        <Comments nft={nft} />
      </Suspense> */}
    </View>
  );
}

export { NftScreen };
