export default function createCarpoolKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }