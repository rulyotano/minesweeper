import React from "react";
import { useTheme } from "@material-ui/core";

export default function RankingIcon({ height = null, width = null, useOriginalColor = false }) {
  const theme = useTheme();

  const color = useOriginalColor ? "#000000" : theme.palette.text.primary

  const heightValue = height || theme.spacing(3)
  const widthValue = width || theme.spacing(3)
  return (
    <svg id="Layer_1"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324.701 324.701" width={widthValue} height={heightValue}>
      <path fill={color} d="M242.538,154.438c12.071-1.032,22.667-6.11,31.544-15.153c30.51-31.08,29.583-100.347,29.529-103.28  c-0.1-5.447-4.543-9.81-9.992-9.814l-50.269-0.033V5c0-2.762-2.239-5-5-5h-152c-2.761,0-5,2.238-5,5v21.156L31.082,26.19  c-5.448,0.004-9.891,4.367-9.992,9.814c-0.055,2.934-0.981,72.2,29.529,103.28c8.877,9.043,19.474,14.121,31.544,15.153  c4.617,32.323,28.831,58.395,60.188,65.782v62.933h-25.333c-1.635,0-3.166,0.799-4.101,2.14l-22,31.549  c-1.066,1.528-1.193,3.522-0.331,5.174c0.861,1.651,2.57,2.686,4.433,2.686c0,0,134.678-0.001,134.686,0c2.761,0,5-2.238,5-5  c0-1.21-0.507-2.195-1.145-3.184l-21.774-31.226c-0.935-1.341-2.466-2.14-4.101-2.14h-25.333V220.22  C213.707,212.832,237.921,186.761,242.538,154.438z M283.457,46.183c-0.965,22.133-6.193,61.311-23.647,79.091  c-4.822,4.911-10.247,7.849-16.459,8.91V46.156L283.457,46.183z M41.253,46.183l40.097-0.026v88.027  c-6.207-1.061-11.626-3.991-16.444-8.894C47.486,107.563,42.236,68.339,41.253,46.183z M120.917,83.455l28.63-4.16l12.804-25.943  l12.804,25.943l28.63,4.16l-20.717,20.194l4.891,28.515l-25.607-13.463l-25.607,13.463l4.891-28.515L120.917,83.455z" />
    </svg>
  );
}
