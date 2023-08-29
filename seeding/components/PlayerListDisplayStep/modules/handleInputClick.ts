import React from "react";

export default function handleInputClick(index: number, inputRefs: React.RefObject<HTMLInputElement>[]) {
  if (inputRefs[index].current) {
    inputRefs[index].current!.focus();
  }
}
