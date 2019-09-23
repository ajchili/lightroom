export interface Bridge {
  id: string;
  internalipaddress: string;
}

export interface Light {
  state: {
    on: boolean;
    bri: number;
    alert: string;
    mode: string;
    reachable: boolean;
  };
  swupdate: {
    state: string;
    lastinstall: string;
  };
  type: string;
  name: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: {
    certified: boolean;
    control: {
      mindimlevel: number;
      maxlumen: number;
    };
    streaming: {
      renderer: boolean;
      proxy: boolean;
    };
  };
  config: {
    archetype: string;
    function: string;
    direction: string;
    startup: {
      mode: string;
      configured: boolean;
    };
  };
  uniqueid: string;
  swversion: string;
  swconfigid: string;
  productid: string;
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
      devicetype: "lightroom#web"
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

export const getLights = async (
  internalipaddress: string,
  username: string
): Promise<Array<Light>> => {
  const response = await fetch(`http://${internalipaddress}/api/${username}/lights`);
  const json = await response.json();
  return json as Array<Light>;
};
