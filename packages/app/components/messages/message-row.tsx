import { useMemo, useCallback } from "react";
import { Platform, Linking } from "react-native";

import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";
import reactStringReplace from "react-string-replace";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button, TextButton } from "@showtime-xyz/universal.button";
import {
  HeartFilled,
  Heart,
  MessageFilled,
  Message,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { Link } from "app/navigation/link";
import { convertUTCDateToLocalDate, formatAddressShort } from "app/utilities";

const mentionRegex = /@([\w\d-]+?)\b/g;
const hyperlinkRegex = /(https?:\/\/)?([0-9a-z]+\.)?[-_0-9a-z]+\.[0-9a-z]+/g;

const linkify = (content: string, router: any) => {
  // first replace all the mentions
  const contentWithMention = reactStringReplace(
    content,
    mentionRegex,
    (username: string, i: number) => {
      return (
        <Text
          onPress={() => {
            router.pop();
            router.push(`/@${username}`);
          }}
          tw="font-bold text-black dark:text-white"
          key={i}
        >
          @{username}
        </Text>
      );
    }
  );

  // next replace all the hyperlinks
  const result = contentWithMention.map((token) => {
    if (typeof token === "string") {
      return (token as string).split(" ").map((word, i) => {
        if (!hyperlinkRegex.test(word)) {
          return word + " ";
        }
        const match = [...word.match(hyperlinkRegex)!];
        return (
          <Text
            key={i}
            tw="text-blue-500"
            onPress={() => Linking.openURL(match[0])}
          >
            {match[0]}
          </Text>
        );
      });
    } else {
      return token;
    }
  });

  return result;
};

interface MessageRowProps {
  /**
   * Defines the address of the message owner.
   * @default undefined
   */
  address?: string;
  /**
   * Defines the message owner username.
   * @default undefined
   */
  username?: string;
  /**
   * Defines the message owner avatar url.
   * @default undefined
   */
  userAvatar?: string;
  /**
   * Defines whether the message owner is verified or not.
   * @default undefined
   */
  userVerified?: boolean | 0 | 1;
  /**
   * Defines whether the message has parent or not.
   * @default undefined
   */
  hasParent?: boolean;
  /**
   * Defines whether the message has replies or not.
   * @default undefined
   */
  hasReplies?: boolean;
  /**
   * Defines whether the message liked by the customer or not.
   * @default undefined
   */
  likedByMe?: boolean;
  /**
   * Defines whether the message replied by the customer or not.
   * @default undefined
   */
  repliedByMe?: boolean;
  /**
   * Defines the message content.
   * @default undefined
   */
  content?: string;
  /**
   * Defines the message position in the replies list.
   * @default undefined
   */
  position?: undefined | "middle" | "last";
  /**
   * Defines the message likes count.
   * @default undefined
   */
  likeCount?: number | string;
  /**
   * Defines the message replies count.
   * @default undefined
   */
  replayCount?: number | string;
  /**
   * Defines the message creation date.
   * @default undefined
   */
  createdAt?: string;
  /**
   * Defines the like press callback
   * @default undefined
   */
  onLikePress?: () => void;
  /**
   * Defines the delete press callback
   * @default undefined
   */
  onDeletePress?: () => void;
  /**
   * Defines the reply press callback
   * @default undefined
   */
  onReplyPress?: () => void;
  /**
   * Defines the content tag press callback
   * @default undefined
   */
  onTagPress?: (tag: string) => void;
  /**
   * Defines the user press callback
   * @default undefined
   */
  onUserPress?: (username: string) => void;
}

export function MessageRow({
  address,
  username = "",
  userAvatar,
  userVerified = false,
  content = "",
  likeCount = 0,
  replayCount,
  createdAt,
  position,
  hasParent,
  hasReplies,
  likedByMe,
  // eslint-disable-next-line unused-imports/no-unused-vars
  repliedByMe,
  onLikePress,
  onDeletePress,
  onReplyPress,
  onTagPress,
  onUserPress,
}: MessageRowProps) {
  const router = useRouter();

  //#region variables
  const createdAtText = useMemo(() => {
    if (!createdAt) return undefined;

    const currentTime = new Date();
    const createdAtDate = convertUTCDateToLocalDate(createdAt);

    if (differenceInSeconds(currentTime, createdAtDate) < 10) {
      return "now";
    }

    return formatDistanceToNowStrict(createdAtDate, {
      addSuffix: true,
    });
  }, [createdAt]);
  const contentWithTags = useMemo(() => {
    return onTagPress ? linkify(content, router) : content;
  }, [content, onTagPress, router]);
  const userNameText = useMemo(() => {
    return username || formatAddressShort(address);
  }, [address, username]);
  //#endregion

  //#region styles
  const replyVerticalLineTW = useMemo(
    () => [
      "absolute",
      "w-[1px]",
      "bg-[#27272A]",
      hasReplies
        ? "top-4 bottom-[-16px]"
        : position !== "last"
        ? "top-[-16px] bottom-[-16px]"
        : "top-[-16px] h-4",
      hasReplies ? "left-1/2" : "left--5",
    ],
    [hasReplies, position]
  );
  const replyHorizontalLineTW = useMemo(
    () => ["absolute", "left--5 right-0"],
    []
  );
  const replyHorizontalLineStyle = useMemo(
    () => ({
      borderBottomLeftRadius: 12,
      borderBottomWidth: position === "last" ? 1 : 0,
      borderLeftWidth: position === "last" ? 1 : 0,
      top: position !== "last" ? 12 : 0,
      height: position === "last" ? 12 : hasParent ? 1 : 0,
      backgroundColor: position !== "last" ? "#27272A" : undefined,
      borderColor: "#27272A",
    }),
    [position, hasParent]
  );
  //#endregion

  const handleOnPressUser = useCallback(() => {
    if (Platform.OS !== "web" && onUserPress) {
      onUserPress(username);
    }
  }, [onUserPress, username]);

  return (
    <View tw="flex flex-row bg-white py-4 dark:bg-black">
      {hasParent && <View tw="ml-4" collapsable={true} />}
      <View tw="items-center">
        {(hasReplies || hasParent) && (
          <>
            <View tw={replyHorizontalLineTW} style={replyHorizontalLineStyle} />
            <View tw={replyVerticalLineTW} />
          </>
        )}
        <Link href={`/@${username || address}`}>
          <Button
            variant="secondary"
            size="small"
            tw="h-[24px] w-[24px]"
            onPress={handleOnPressUser}
            iconOnly
          >
            <Avatar url={userAvatar} size={24} />
          </Button>
        </Link>
      </View>
      <View tw="ml-2 flex-1">
        <Link href={`/@${username || address}`}>
          <View tw="mb-3 h-[12px] flex-row items-center">
            <Text
              tw="text-13 font-semibold text-gray-900 dark:text-white"
              onPress={handleOnPressUser}
            >
              @{userNameText}
            </Text>
            {userVerified ? (
              <VerificationBadge style={{ marginLeft: 4 }} size={12} />
            ) : null}
          </View>
        </Link>

        <Text tw="text-13 text-gray-900 dark:text-gray-100">
          {contentWithTags}
        </Text>

        <View tw="ml--2 mt-2 mb--2 flex-row">
          <Button
            variant="text"
            tw="px-2"
            accentColor={
              likedByMe
                ? [colors.black, colors.white]
                : [colors.gray[500], colors.gray[500]]
            }
            onPress={onLikePress}
          >
            {likedByMe ? <HeartFilled /> : <Heart />}
            {` ${likeCount}`}
          </Button>
          {replayCount != undefined ? (
            <TextButton
              tw="px-2"
              accentColor={
                // TODO: use `repliedByMe` when this is available.
                replayCount > 0
                  ? [colors.black, colors.white]
                  : [colors.gray[500], colors.gray[500]]
              }
              onPress={onReplyPress}
            >
              {
                // TODO: use `repliedByMe` when this is available.
                replayCount > 0 ? <MessageFilled /> : <Message />
              }
              {` ${replayCount}`}
            </TextButton>
          ) : (
            <TextButton
              tw="px-2"
              accentColor={
                // TODO: use `repliedByMe` when this is available.
                [colors.gray[500], colors.gray[500]]
              }
              onPress={onReplyPress}
            >
              {
                // TODO: use `repliedByMe` when this is available.
                <Message />
              }
            </TextButton>
          )}
          <View
            tw={[
              "flex-1 flex-row items-center justify-end",
              onDeletePress ? "mr--3" : "",
            ]}
          >
            {createdAtText && (
              <Text tw="text-xs font-bold text-gray-500">
                {`${createdAtText}${onDeletePress ? "  •" : ""}`}
              </Text>
            )}
            {onDeletePress && (
              <Button variant="text" tw="ml--1.5" onPress={onDeletePress}>
                Delete
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
