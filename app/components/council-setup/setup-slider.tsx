import React from "react";
import { useCouncilSetupStore } from "store/council-setup.store";
import { Slider } from "~/components/ui/slider";

export const SetupSlider = () => {
  const { councilSize, setCouncilSize } = useCouncilSetupStore();

  return (
    <div className="flex items-center gap-5 w-full justify-end">
      <div>
        <p className=" font-bold text-2xl text-[#7F0DF2]">{councilSize}</p>
      </div>
      <div className="flex-1">
        <Slider
          defaultValue={[1]}
          value={[councilSize]}
          onValueChange={(value) => setCouncilSize(value[0])}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
