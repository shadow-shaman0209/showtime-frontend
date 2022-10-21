import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type DataPillProps = {
  type?: "primary" | "secondary";
  label?: string;
  tw?: string;
  textTw?: string;
};

export const DataPill = (props: DataPillProps) => {
  const { type = "primary", label, tw = "", textTw = "" } = props;

  return (
    <View
      tw={[
        `items-center justify-center rounded-full py-2 px-2 ${
          type === "primary"
            ? "bg-gray-100 dark:bg-gray-900 "
            : " bg-gray-900 dark:bg-gray-100"
        } ${tw}`,
      ]}
    >
      <Text
        tw={[
          `text-xs font-medium ${
            type === "primary"
              ? "text-gray-500 "
              : " text-white dark:text-gray-900"
          }`,
          textTw,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};
