import axios from "axios";

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

export interface LightState {
  on?: boolean;
  sat?: number;
  bri?: number;
  hue?: number;
}

export const getBridges = async (): Promise<Bridge[]> => {
  const response = await axios({
    headers: {
      accept: "appplication/json",
    },
    method: "GET",
    url: "http://discovery.meethue.com/",
  });
  return response.data as Bridge[];
};

export const connectToBridge = async (
  internalipaddress: string,
): Promise<string> => {
  const response = await axios({
    data: {
      devicetype: "lightroom#web",
    },
    headers: {
      accept: "appplication/json",
    },
    method: "POST",
    url: `http://${internalipaddress}/api`,
  });
  const first = response.data[0];
  const hasErrors = (response.data as any[]).some((e: any) => !!e.error);
  if (hasErrors) {
    const errors: string[] = (response.data as any[]).filter((e: any) => !!e.error);
    throw errors;
  }
  return first.success.username;
};

export const getLights = async (
  internalipaddress: string,
  username: string,
): Promise<Light[]> => {
  const response = await axios({
    headers: {
      accept: "appplication/json",
    },
    method: "GET",
    url: `http://${internalipaddress}/api/${username}/lights`,
  });
  const json = response.data;
  const lights: Light[] = [];
  // tslint:disable-next-line: forin
  for (const id in json) {
    lights.push(json[id] as Light);
  }
  return lights;
};

export const updateLight = async (
  internalipaddress: string,
  username: string,
  light: number,
  state: LightState,
): Promise<any> => {
  const response = await axios({
    data: state,
    headers: {
      accept: "appplication/json",
    },
    method: "PUT",
    url: `http://${internalipaddress}/api/${username}/lights/${light}/state`,
  });
  const hasErrors = (response.data as any[]).some((e: any) => !!e.error);
  if (hasErrors) {
    const errors: string[] = (response.data as any[]).filter((e: any) => !!e.error);
    throw errors;
  }
  return response.data;
};
