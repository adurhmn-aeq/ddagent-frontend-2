import React from "react";
import Image from "next/image";

import microphoneOnIcon from "../../public/microphoneOn.svg";

export default function UnmuteMicrophoneIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="unmute mic"
      width={18}
      height={18}
      src={microphoneOnIcon}
      style={{ width: "20px", height: "20px" }}
    />
  );
}