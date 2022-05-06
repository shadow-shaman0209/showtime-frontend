import { useRef, useLayoutEffect, useState } from "react";
import { Platform } from "react-native";

import type { NFT } from "app/types";

import { Text } from "design-system/text";
import { View } from "design-system/view";

import { tw } from "../../tailwind";
import { Tooltip } from "../../tooltip";

type Props = {
  nft?: NFT;
  cardSize?: string;
};

function Title({ nft, cardSize }: Props) {
  const [isUseTooltip] = useState(Platform.OS === "web");
  /**
   * Todo: If the content width is greater than the container width, use Tooltip components,
   * but now RecyclerList is used, I can't get valid data, so wait until we replace the list and then implement.
   *
   * */
  // const textRef = useRef<HTMLElement | null>(null);
  // useLayoutEffect(() => {
  // if (textRef.current && Platform.OS === "web") {
  // use range width instead of scrollWidth to determine whether the text is overflowing
  // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
  // const range = document.createRange();
  // range.setStart(textRef.current, 0);
  // range.setEnd(textRef.current, textRef.current.childNodes.length);
  // const rangeWidth = range.getBoundingClientRect().width;
  // setIsOverflow(
  //   rangeWidth + 16 > textRef.current.offsetWidth ||
  //     textRef.current.scrollWidth > textRef.current.offsetWidth
  // );
  // }
  // }, []);
  if (!nft) return null;
  return (
    <View tw="bg-white px-4 py-2 dark:bg-black">
      {isUseTooltip ? (
        <Tooltip
          delay={300}
          text={nft.token_name}
          contentStyle={tw.style(`max-${cardSize}`)}
        >
          <Text
            tw="font-semibold text-black dark:text-white"
            numberOfLines={1}
            variant="text-lg"
          >
            {nft.token_name}
          </Text>
        </Tooltip>
      ) : (
        <Text
          tw="font-semibold text-black dark:text-white"
          numberOfLines={1}
          variant="text-lg"
        >
          {nft.token_name}
        </Text>
      )}
    </View>
  );
}

export { Title };
