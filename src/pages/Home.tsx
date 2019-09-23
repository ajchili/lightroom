import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
  Typography
} from "@material-ui/core";
import { getBridges } from "../apis/hue";

interface State {
  bridgeAddress: string;
}

export default class extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      bridgeAddress: ""
    };
  }

  _detectBrdiges = () => {
    getBridges()
      .then(bridges => {
        if (bridges.length === 0) {
        } else if (bridges.length === 1) {
          this.setState({ bridgeAddress: bridges[0].internalipaddress });
        } else {
        }
      })
      .catch(err => {
        alert(
          "There was an unexpected error encountered when detecting bridges."
        );
        console.error(err);
      });
  };

  render() {
    const { bridgeAddress } = this.state;
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
                disabled={bridgeAddress.length === 0}
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
