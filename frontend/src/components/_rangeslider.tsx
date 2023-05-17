import React, { useEffect } from "react";
import { useState } from "react";
// Flowbite
import { Badge } from "flowbite-react";
// HeroIcons
import { HiChartPie } from "react-icons/hi2";
// Radix
import * as Slider from '@radix-ui/react-slider';
// SearchKit
import { connectRange } from "react-instantsearch-dom";

import { useDebounce } from "../components/_debounce";


type RangeSliderProps = {
  attribute: string;
  min: number;
  max: number;
  step: number;
  // optional default min/max values (defaulting to min/max)
  defaultMin?: number;
  defaultMax?: number;
  // searchkit
  currentRefinement: any;
  refine: (value: any) => void;
}

const RangeSlider = ({
  currentRefinement,
  min,
  max,
  step,
  refine,
}: RangeSliderProps) => {
  const defaultMin = min;
  const defaultMax = max;
  const [minValue, setMinValue] = useState(currentRefinement.min);
  const [maxValue, setMaxValue] = useState(currentRefinement.max);

  // Debounce
  const debouncedMinValue = useDebounce(minValue, 500);
  const debouncedMaxValue = useDebounce(maxValue, 500);

  const onValueChange = (values: number[]) => {
    setMinValue(values[0]);
    setMaxValue(values[1]);
  };

  // const onValueCommit = (values: number[]) => {
  //   refine({ min: values[0], max: values[1] });
  // };

  useEffect(() => {
    refine({ min: debouncedMinValue, max: debouncedMaxValue });
  }, [debouncedMinValue, debouncedMaxValue, refine]);


  return (
    <div className="grid grid-rows-2 m-0"> {/* Two rows, 1. icon, stars; 2. Slider */}
      <div className="flex items-center justify-left">
        <HiChartPie className="text-2xl text-gray-500 dark:text-gray-500" />
        <p className="px-3">Stars</p>
        <Badge
            size="sm"
            // Blue
            className="inline-block mr-2 text-white bg-blue-500"
          >
            Rating: from {minValue} to {maxValue}
        </Badge>
      </div>
      <div className="flex items-center justify-center">
        <Slider.Root
          min={min}
          max={max}
          step={step}
          value={[minValue, maxValue]}
          defaultValue={[defaultMin, defaultMax]}
          onValueChange={onValueChange}
          // onValueCommit={onValueCommit}
          className="flex relative w-full h-10 items-center"
        >
          <Slider.Track className="relative grow w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-gray-500 dark:border-gray-700 hover:border-blue-500 rounded-full shadow-sm cursor-pointer" />
          <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-gray-500 dark:border-gray-700 hover:border-blue-500 rounded-full shadow-sm cursor-pointer" />
        </Slider.Root>
      </div>
    </div>
  )
}

export const CustomRangeSlider = connectRange(RangeSlider);