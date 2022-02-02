import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { TrendingScreen } from "app/screens/trending";
import { TrendingStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";
import { useIsDarkMode } from "design-system/hooks";

const SettingsScreen = dynamic<JSX.Element>(() =>
  import("app/screens/settings").then((mod) => mod.SettingsScreen)
);

const TrendingStack = createStackNavigator<TrendingStackParams>();

function TrendingNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <TrendingStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions({ safeAreaTop, isDark })}
    >
      <TrendingStack.Group>
        <TrendingStack.Screen
          name="trending"
          component={TrendingScreen}
          options={{ title: "Trending", headerTitle: "Trending" }}
        />
      </TrendingStack.Group>
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
