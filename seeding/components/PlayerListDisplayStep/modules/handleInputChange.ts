import React from "react";

export function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, setValue:(value: number) => void) {
  const newValue = parseInt(event.target.value);
  setValue(newValue);
}
