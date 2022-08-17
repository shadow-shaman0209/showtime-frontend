import { Component, forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

class ScrollViewClass extends Component<ScrollViewProps & { innerRef?: any }> {
  constructor(props: ScrollViewProps) {
    super(props);
  }

  render() {
    const { tw, asKeyboardAwareScrollView, innerRef, ...props } = this.props;
    const StyledScrollViewComponent = asKeyboardAwareScrollView
      ? styled(KeyboardAwareScrollView)
      : styled(ReactNativeScrollView);

    return (
      <StyledScrollViewComponent
        keyboardShouldPersistTaps="handled"
        {...props}
        //@ts-ignore
        ref={innerRef}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      />
    );
  }
}

const ScrollView = forwardRef((props: ScrollViewProps, ref: any) => (
  <ScrollViewClass
    //@ts-ignore
    innerRef={ref}
    {...props}
  />
));

ScrollView.displayName = "ScrollView";

export { ScrollView };
