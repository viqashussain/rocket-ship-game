import React, { Component, Props } from "react";
import { Image } from "react-native";
interface Props { 
    body: { position: { x: number, y: number } }; 
    size: number[]
}
export default class AsteroidRock extends Component<Props, {}> {
    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        const image = require('../assets/img/asteroid.png');

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