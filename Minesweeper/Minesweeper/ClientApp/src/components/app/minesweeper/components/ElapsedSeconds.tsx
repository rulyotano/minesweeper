import React from "react";
import {
  calculateTimeElapsed
} from "../helpers/gameHelper";

const ElapsedSeconds: React.FunctionComponent<ElapsedSecondsProps> = (
  props: ElapsedSecondsProps
) => {
  const {startTime, endTime} = props;
  const [ currentTime, setCurrentTime ] = React.useState(0);
  const calculateTimeParams = {
    startTime,
    endTime
  };
  const calculateTimeParamsRef = React.useRef(calculateTimeParams);
  calculateTimeParamsRef.current = calculateTimeParams;

  React.useEffect(
    () => {

      const intervalId = setInterval(() => {
        const { startTime, endTime } = calculateTimeParamsRef.current;
        setCurrentTime(calculateTimeElapsed(startTime, endTime));
      }, UPDATE_TIME_PERIOD_MS);

      return () => clearInterval(intervalId);
    },
    // eslint-disable-next-line
    [ ]
  );

  return <React.Fragment>{currentTime}</React.Fragment>;
};

interface ElapsedSecondsProps {
  startTime: Date | null;
  endTime: Date | null;
}

const UPDATE_TIME_PERIOD_MS = 500;

export default React.memo(ElapsedSeconds);
