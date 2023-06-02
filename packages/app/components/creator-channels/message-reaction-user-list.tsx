import { useCallback, useState, useMemo, useEffect } from "react";

import { TabView } from "react-native-tab-view";

import {
  Route,
  SceneRendererProps,
  ScollableAutoWidthTabBar,
} from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { createParam } from "app/navigation/use-param";

import { UserList } from "../user-list";
import { useChannelById } from "./hooks/use-channel-detail";
import { useChannelMessages } from "./hooks/use-channel-messages";
import { ChannelMessageItem } from "./hooks/use-channel-messages";
import { useReactionsUserList } from "./use-reactions-user-list";

type Query = {
  channelId: string;
  messageId: string;
  selectedReactionId: string;
};
const { useParam } = createParam<Query>();

export const MessageReactionUserListModal = () => {
  const [channelId] = useParam("channelId");
  const [selectedReactionId] = useParam("selectedReactionId");
  const [messageId] = useParam("messageId");
  const [index, setIndex] = useState(0);
  const channelMessages = useChannelMessages(channelId);
  const channelDetails = useChannelById(channelId);

  const message = useMemo(() => {
    let msg: ChannelMessageItem | null = null;
    channelMessages.data?.forEach((m) => {
      if (m.channel_message.id === Number(messageId)) {
        msg = m;
      }
    });
    return msg;
  }, [channelMessages.data, messageId]);

  const routes = useMemo(() => {
    if (!message) return [];
    return (message as ChannelMessageItem).reaction_group.map((r, index) => {
      const reaction = channelDetails.data?.channel_reactions?.find(
        (d) => d.id === r.reaction_id
      );
      return {
        index,
        title: reaction?.reaction + " " + r.count,
        key: r.reaction_id.toString(),
      };
    });
  }, [channelDetails.data, message]);

  useEffect(() => {
    if (!routes || !selectedReactionId) return;
    const index = routes.findIndex((r) => r.key === selectedReactionId);
    if (index !== -1) {
      setIndex(index);
    }
  }, [routes, selectedReactionId]);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <ReactionUserList
          reactionId={route.key}
          mount={index === route.index}
        />
      );
    },
    [index]
  );

  if (!selectedReactionId || routes.length === 0) return null;

  return (
    <View tw="flex-1">
      <TabView
        renderTabBar={ScollableAutoWidthTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
};

const ReactionUserList = ({
  reactionId,
  mount,
}: {
  reactionId: string;
  mount: boolean;
}) => {
  const [messageId] = useParam("messageId");
  const [mounted, setMounted] = useState(false);
  const reactionsUsers = useReactionsUserList(
    mounted ? { messageId, reactionId } : {}
  );

  if (mount && !mounted) {
    setMounted(true);
  }

  return (
    <UserList
      loading={reactionsUsers.isLoading || !mounted}
      users={reactionsUsers.users}
      onEndReached={reactionsUsers.fetchMore}
    />
  );
};
