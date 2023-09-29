import React from "react";
import { Player } from "../../../definitions/seedingTypes";

export function handleKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>,
  index: number,
  value: number | undefined,
  inputRefs: React.RefObject<HTMLInputElement>[],
  players: Player[]
) {
  if (event.key === "Enter") {
    if (inputRefs[index]?.current) {
      inputRefs[index].current!.blur();
    }

    if (!value) {
      if (inputRefs[index].current) {
        inputRefs[index].current!.value = (index + 1).toString();
      }
    } else if (value <= 1 || value > players.length) {
      inputRefs[index].current!.value = (index + 1).toString();
    } else if (value === index + 1) {
      if (inputRefs[index].current) {
        inputRefs[index].current!.value = (index + 1).toString();
      }
    }
  }
}
