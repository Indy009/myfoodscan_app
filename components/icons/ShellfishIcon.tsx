import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ShellfishIcon(props: any) {
  return (
    <Svg
      fill="#000"
      stroke="#000"
      strokeWidth={4}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 485 485"
      xmlSpace="preserve"
      {...props}
    >
      <Path d="M413.974 104.448c-45.803-45.802-106.7-71.027-171.474-71.027S116.829 58.646 71.026 104.448C25.225 150.25 0 211.147 0 275.921v7.818l144.06 100.657v67.182h196.88v-67.182L485 283.739v-7.818c0-64.774-25.225-125.671-71.026-171.473zM257.5 361.579V63.955c47.741 3.345 91.185 22.523 125.094 52.312L274.439 361.579H257.5zm-46.939 0L102.406 116.267C136.315 86.478 179.759 67.3 227.5 63.955v297.624h-16.939zM30.139 268.2c1.755-48.94 20.15-93.705 49.67-128.822l97.965 222.2h-13.993L30.139 268.2zM174.06 421.579v-30h136.88v30H174.06zm147.159-60h-13.993l97.965-222.2c29.521 35.117 47.916 79.882 49.67 128.822l-133.642 93.378z" />
    </Svg>
  );
}

export default ShellfishIcon;
