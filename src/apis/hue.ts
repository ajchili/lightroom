export interface Bridge {
  id: string;
  internalipaddress: string;
}

export const getBridges = async (): Promise<Array<Bridge>> => {
  const response = await fetch("https://discovery.meethue.com/");
  const json = await response.json();
  return json as Array<Bridge>;
};
