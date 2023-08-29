export default function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }