import { svg, circle, line } from 'compote/html';

const clockSize = 17.5;
const clockMargin = 3;
const clockCenter = clockSize / 2;
const clockRadius = clockSize / 2 - clockMargin;
const hoursLineMultiplier = 0.4;
const minutesLineMultiplier = 0.55;

export const timeToXY = (maxTime: number) => (time: number): [number, number] => {
  const multiplier = 2 * Math.PI * time / maxTime;
  return [Math.sin(multiplier), -Math.cos(multiplier)];
};

export const hoursToXY = timeToXY(12);
export const minutesToXY = timeToXY(60);

export const Clock = (date: Date) => {
  const [hoursX, hoursY] = hoursToXY(date.getHours());
  const [minutesX, minutesY] = minutesToXY(date.getMinutes());

  return (
    svg({
      width: clockSize + 2 * clockMargin,
      height: clockSize,
      viewBox: `0 0 ${clockSize} ${clockSize}`,
      style: {
        'stroke-linecap': 'round'
      }
    }, [
      circle({
        cx: clockCenter,
        cy: clockCenter,
        r: clockRadius,
        style: {
          fill: 'none',
          stroke: 'white',
          'stroke-width': 2.25
        }
      }),
      line({
        x1: clockCenter,
        y1: clockCenter,
        x2: clockCenter + hoursLineMultiplier * hoursX * clockRadius,
        y2: clockCenter + hoursLineMultiplier * hoursY * clockRadius,
        style: {
          stroke: 'white',
          'stroke-width': 1.25
        }
      }),
      line({
        x1: clockCenter,
        y1: clockCenter,
        x2: clockCenter + minutesLineMultiplier * minutesX * clockRadius,
        y2: clockCenter + minutesLineMultiplier * minutesY * clockRadius,
        style: {
          stroke: 'white',
          'stroke-width': 1.25
        }
      })
    ])
  );
};
