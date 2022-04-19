import { useCallback } from "react";
import { Platform } from "react-native";

import { Login } from "app/components/login";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal } from "design-system";

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

type Query = {
  redirect_url: string;
};

const { useParam } = createParam<Query>();

function LoginModal() {
  //#region hooks
  const [redirect_url] = useParam("redirect_url");
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();
  //#endregion

  //#region callbacks
  const handleOnLogin = useCallback(() => {
    if (redirect_url && redirect_url.length > 0) {
      /**
       * TODO: we need to get rid off this.
       */
      router.pop();
      router.push(decodeURIComponent(redirect_url));
    } else {
      router.pop();
    }
  }, [redirect_url, router]);
  //#endregion

  return (
    <Modal
      title="Sign In"
      close={router.pop}
      height=""
      keyboardVerticalOffset={topSafeArea + modalPresentationHeight}
      bodyTW="bg-white dark:bg-black"
    >
      <Login onLogin={handleOnLogin} />
    </Modal>
  );
}

export const LoginScreen = withModalScreen(LoginModal, "/login", "loginModal");
