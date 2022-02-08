import React, { Component } from "react";
import { View, Image, Animated } from "react-native";

interface Props { 
    body: Matter.Body; 
    size: number[]
}
export default class Rocket extends Component<Props, {}> {

    animatedValue;

    constructor(props: Props){
        super(props);

        this.animatedValue = new Animated.Value(this.props.body.velocity.y);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        const image = require('../assets/img/rocket.png');


        this.animatedValue.setValue(this.props.body.velocity.x);
        let rotation = this.animatedValue.interpolate({
            inputRange: [-10, 0, 10, 20],
            outputRange: ['-20deg', '0deg', '15deg', '45deg'],
            extrapolate: 'clamp'
        })

        return (
            <Animated.Image
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    transform: [{ rotate: rotation }]
                }}
                resizeMode="stretch"
                source={image} />
    );
  }
}