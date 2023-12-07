import React from "react";
import Image from "next/image";

import microphoneOffIcon from "../../public/microphoneOff.svg";

export default function MuteMicrophoneIcon(): JSX.Element {
  return (
    <Image
      alt="mute mic"
      width={18}
      height={18}
      src={microphoneOffIcon}
      style={{ width: "20px", height: "20px" }}
    />
  );
}