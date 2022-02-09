import { Dimensions } from 'react-native';

const Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    MAX_ASTEROIDS_ON_SCREEN: 5,
    ADD_FUEL_SECOND_INTERVAL: 10,
    OBJECT_SIZES: [
        { coin: 50, asteroidRestitution: 2, asteroid: 20, fuel: 30, level: 1 },
        { coin: 30, asteroidRestitution: 1, asteroid: 45, fuel: 30, level: 2 },
        { coin: 15, asteroidRestitution: 0.5, asteroid: 75, fuel: 30, level: 3 }
    ]
};
export default Constants;