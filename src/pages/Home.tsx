import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import {
  connectToBridge,
  getBridges,
  getLights,
  Light,
  LightState,
  updateLight
} from "../apis/hue";

interface State {
  bridgeAddress: string;
  fetchLightsInterval?: NodeJS.Timeout;
  lights: Array<Light>;
  username: string;
  strobe?: NodeJS.Timeout;
}

export default class extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      bridgeAddress: window.localStorage.getItem("bridgeAddress") || "",
      username: window.localStorage.getItem("username") || "",
      lights: []
    };
    this._detectLights();
  }

  _connect = async () => {
    const { bridgeAddress } = this.state;
    try {
      const username = await connectToBridge(bridgeAddress);
      window.localStorage.setItem("username", username);
      this.setState({ username });
      this._detectLights();
    } catch (err) {
      alert(err);
    }
  };

  _detectBrdiges = async () => {
    try {
      const bridges = await getBridges();
      if (bridges.length === 0) {
        alert("No bridges detected!");
      } else if (bridges.length === 1) {
        const bridgeAddress = bridges[0].internalipaddress;
        this.setState({ bridgeAddress });
        window.localStorage.setItem("bridgeAddress", bridgeAddress);
      } else {
        alert("Multiple bridges found! This is currently not supported!");
      }
    } catch (err) {
      alert(
        "There was an unexpected error encountered when detecting bridges."
      );
      console.error(err);
    }
  };

  _detectLights = async () => {
    const { bridgeAddress, fetchLightsInterval, username } = this.state;

    if (bridgeAddress && username) {
      try {
        const lights = await getLights(bridgeAddress, username);
        this.setState({ lights });
        if (!fetchLightsInterval) {
          const interval = setInterval(this._detectLights, 2500);
          this.setState({ fetchLightsInterval: interval });
        }
      } catch (err) {
        if (fetchLightsInterval) {
          clearInterval(fetchLightsInterval);
        }
      }
    }
  };

  _updateLight = async (light: number, state: LightState) => {
    const { bridgeAddress, username } = this.state;

    if (bridgeAddress && username) {
      try {
        await updateLight(bridgeAddress, username, light, state);
        await this._detectLights();
      } catch (err) {
        console.error(err);
      }
    }
  };

  _toggleStrobe = () => {
    const { strobe } = this.state;
    if (strobe) {
      clearInterval(strobe);
    } else {
      const interval = setInterval(async () => {
        const { bridgeAddress, username, lights } = this.state;

        if (bridgeAddress && username) {
          lights.forEach((light: Light, i: number) => {
            this._updateLight(i + 1, {
              on: !light.state.on
            });
          });
        }
      }, 1000);
      this.setState({ strobe: interval });
    }
  };

  render() {
    const { bridgeAddress, lights } = this.state;

    const isConnected =
      bridgeAddress === (window.localStorage.getItem("bridgeAddress") || "") &&
      !!window.localStorage.getItem("username");
    const canConnect = bridgeAddress.length !== 0 && !isConnected;

    return (
      <div
        style={{
          minHeight: "calc(100vh - 10)",
          maxWidth: "100%",
          margin: 10
        }}
      >
        <Card raised={true}>
          <CardContent>
            <Typography variant="h1">lightroom</Typography>
            <TextField
              label="Bridge Address"
              margin="normal"
              variant="outlined"
              fullWidth={true}
              value={bridgeAddress}
              onChange={event => {
                this.setState({ bridgeAddress: event.target.value });
              }}
            />
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={this._connect}
                disabled={!canConnect}
              >
                Connect
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this._detectBrdiges}
                disabled={bridgeAddress.length !== 0}
              >
                Detect
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this._toggleStrobe}
                disabled={!isConnected}
              >
                Strobe
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  window.localStorage.clear();
                  this.setState({
                    bridgeAddress: "",
                    username: "",
                    lights: []
                  });
                }}
                disabled={!isConnected}
              >
                Disconnect
              </Button>
            </ButtonGroup>
            <Grid container spacing={3} style={{ marginTop: 5 }}>
              {lights.map((light: Light, i: number) => {
                return (
                  <Grid key={light.uniqueid} item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">
                          {light.name}{" "}
                          <Switch
                            checked={light.state.on}
                            color="primary"
                            onChange={() => {
                              this._updateLight(i + 1, { on: !light.state.on });
                            }}
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
}
