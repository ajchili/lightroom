export interface Bridge {
  id: string;
  internalipaddress: string;
}

export const getBridges = async (): Promise<Array<Bridge>> => {
  const response = await fetch("https://discovery.meethue.com/");
  const json = await response.json();
  return json as Array<Bridge>;
};

export const connectToBridge = async (
  internalipaddress: string
): Promise<string> => {
  const response = await fetch(`http://${internalipaddress}/api`, {
    body: JSON.stringify({
      devicetype: "my_hue_app#lightroom"
    }),
    method: "POST"
  });
  const json = await response.json();
  const first = json[0];
  if (first.error) {
    throw new Error(first.error.description);
  }
  return first.success.username;
};
