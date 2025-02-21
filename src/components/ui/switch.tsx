import React from "react";
import { useToggleState } from "@react-stately/toggle";
import { type AriaSwitchProps, useSwitch } from "@react-aria/switch";
import { useFocusRing } from "@react-aria/focus";
import { cn } from "@/utils/utils";

interface SwitchProps extends AriaSwitchProps {
    label?: string;
}

const Switch: React.FC<SwitchProps> = (props) => {
    const state = useToggleState(props);
    const ref = React.useRef<HTMLInputElement>(null);
    const { inputProps } = useSwitch(props, state, ref);
    const { focusProps } = useFocusRing();
    const isSelected = state.isSelected;

    return (
        <React.Fragment>
            <div className="flex items-center gap-2">
                <label
                    className={cn(
                        "inline-flex items-center cursor-pointer select-none",
                        "py-1 px-2.5 rounded-3xl transition-colors duration-300 ease-in-out",
                        isSelected ? "bg-green-500" : "bg-gray-300"
                    )}
                    style={{
                        opacity: props.isDisabled ? 0.4 : 1,
                    }}
                >
                    <input {...inputProps} {...focusProps} ref={ref} className="absolute opacity-0 w-0 h-0" />
                    <div
                        className={cn(
                            "relative w-8 h-5 rounded-xl transition-bg-color duration-300 ease-in-out",
                            isSelected ? "bg-green-500" : "bg-gray-300"
                        )}
                    >
                        <div
                            className={cn(
                                "w-4 h-4 bg-white rounded-[50%] absolute top-0.5 transition-[left] duration-300 ease-in-out",
                                isSelected ? "left-5" : "left-0"
                            )}
                        />
                    </div>
                </label>
                <span className="text-sm">{props.label}</span>
            </div>
        </React.Fragment>
    );
};

export { Switch };
