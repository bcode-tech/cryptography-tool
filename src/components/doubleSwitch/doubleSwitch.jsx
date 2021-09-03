import React from "react";
import "./doubleSwitch.scss";

export default function DoubleSwitch({
    rightValue,
    leftValue,
    value,
    onChange,
    theme,
}) {
    return (
        <div className={`double-switch ${theme !== 'light' ? "dark" : ""}`}>
            <div className="element left" onClick={() => onChange(false)}>
                {leftValue}
            </div>
            <div className="element right" onClick={() => onChange(true)}>
                {rightValue}
            </div>
            <div
                className={`element pivot ${value ? "to-right" : "to-left"}`}
            />
        </div>
    );
}
