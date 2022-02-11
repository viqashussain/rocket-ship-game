import { Dimensions } from 'react-native';

const Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    MAX_ASTEROIDS_ON_SCREEN: 5,
    ADD_FUEL_SECOND_INTERVAL: 2,
    OBJECT_SIZES: [
        { coin: 50, asteroidRestitution: 2, asteroid: 20, fuel: 50, level: 1 },
        { coin: 50, asteroidRestitution: 1, asteroid: 45, fuel: 50, level: 2 },
        { coin: 50, asteroidRestitution: 0.5, asteroid: 75, fuel: 50, level: 3 }
    ]
};
export default Constants;