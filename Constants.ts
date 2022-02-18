import { Dimensions, PixelRatio } from 'react-native';

const Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    MAX_ASTEROIDS_ON_SCREEN: 5,
    ADD_FUEL_SECOND_INTERVAL: 10,
    OBJECT_SIZES: [
        { coin: 150 / PixelRatio.get(), asteroidRestitution: 1.5, asteroid: 60 / PixelRatio.get(), fuel: 150 / PixelRatio.get(), level: 1 },
        { coin: 150 / PixelRatio.get(), asteroidRestitution: 1, asteroid: 135 / PixelRatio.get(), fuel: 150 / PixelRatio.get(), level: 2 },
        { coin: 150 / PixelRatio.get(), asteroidRestitution: 0.5, asteroid: 225 / PixelRatio.get(), fuel: 150 / PixelRatio.get(), level: 3 }
    ]
};
export default Constants;