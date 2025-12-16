import { useEffect, type FC } from "react";

import "./modal.css";

interface SliderProps {
  min: string;
  max: string;
  step: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const Slider: FC<SliderProps> = (props) => {
  const { min, max, step, value, setValue } = props;

  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <div className="slider-main">
      <div className="slider-container">
        <div className="slider-label">Volume: {value / 10}</div>
        <button
          className="slider-btn"
          onClick={() => setValue((v) => Math.max(v - step * 5, 0))}
        >
          {"<<"}
        </button>
        <button
          className="slider-btn"
          onClick={() => setValue((v) => Math.max(v - step, 0))}
        >
          {"<"}
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="slider"
        />
        <button
          className="slider-btn"
          onClick={() => setValue((v) => Math.min(v + step, 100))}
        >
          {">"}
        </button>
        <button
          className="slider-btn"
          onClick={() => setValue((v) => Math.min(v + step * 5, 100))}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};
