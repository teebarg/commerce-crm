"use client";

import React from "react";
import { useToggleState } from "@react-stately/toggle";
import { type AriaSwitchProps, useSwitch } from "@react-aria/switch";

interface SwitchProps extends AriaSwitchProps {
    label?: string;
}

const Switch: React.FC<SwitchProps> = (props) => {
    const state = useToggleState(props);
    const ref = React.useRef<HTMLInputElement>(null);
    const { inputProps } = useSwitch(props, state, ref);

    return (
        <React.Fragment>
            <div className="flex items-center gap-2">
                <label className="inline-flex items-center cursor-pointer relative">
                    <input {...inputProps} ref={ref} className="sr-only peer" />
                    <div className="w-11 h-6 bg-default-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className="text-sm">{props.label}</span>
            </div>
        </React.Fragment>
    );
};

export { Switch };
