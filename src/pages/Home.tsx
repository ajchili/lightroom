import React, { Component } from "react";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";

export default class extends Component {
  render() {
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
            />
          </CardContent>
        </Card>
      </div>
    );
  }
}
