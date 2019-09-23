import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
  Typography
} from "@material-ui/core";
import { connectToBridge, getBridges } from "../apis/hue";

interface State {
  bridgeAddress: string;
  username: string;
}

export default class extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      bridgeAddress: window.localStorage.getItem("bridgeAddress") || "",
      username: window.localStorage.getItem("username") || ""
    };
  }

  _connect = async () => {
    const { bridgeAddress } = this.state;
    try {
      const username = await connectToBridge(bridgeAddress);
      window.localStorage.setItem("username", username);
      this.setState({ username });
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

  render() {
    const { bridgeAddress } = this.state;

    const canConnect =
      bridgeAddress.length !== 0 &&
      (bridgeAddress !== (window.localStorage.getItem("bridgeAddress") || "") ||
        !window.localStorage.getItem("username"));

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
            <ButtonGroup aria-label="outlined button group">
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
            </ButtonGroup>
          </CardContent>
        </Card>
      </div>
    );
  }
}
