import React, { Component } from "react";
import { View, Image, Animated } from "react-native";

interface Props { 
    body: Matter.Body; 
    size: number[]
}

export default class SilverCoin extends Component<Props, {}> {
    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        const image = require('../assets/img/silvercoin.gif');

        return (
            <Image
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                }}
                resizeMode="stretch"
                source={image} />
    );
  }
}