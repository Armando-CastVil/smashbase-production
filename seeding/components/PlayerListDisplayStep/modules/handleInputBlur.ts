import React from "react";
import { Player } from "../../../definitions/seedingTypes";
import editSeed from "./editSeed";

export function handleInputBlur(
  index: number,
  value: number | undefined,
  inputRefs:any,
  players: Player[],
  setPreavoidanceplayerList: (preAvoidancePlayers: Player[]) => void
) {
  if (!value) {
    if (inputRefs[index].current) {
      inputRefs[index].current!.value = (index + 1).toString();
    }
  } else if (value < 1 || value > players.length) {
    inputRefs[index].current!.value = (index + 1).toString();
    alert("please enter a value between 1 and " + players.length);
  } else if (value === index + 1) {
    if (inputRefs[index].current) {
      inputRefs[index].current!.value = (index + 1).toString();
    }
  } else {
    editSeed(value, index, players, setPreavoidanceplayerList,inputRefs);
  }
}
