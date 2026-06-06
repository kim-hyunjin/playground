import React from "react";
import styled from "styled-components/native";
import utils from "../../utils";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  padding-left: 20px;
`;

export default () => (
  <Container>
    <Ionicons
      name={utils.isAndroid() ? "md-arrow-down" : "ios-arrow-down"}
      size={28}
    />
  </Container>
);
