import { PixelRatio } from "react-native";
import Constants from "../Constants";

export function numberWithCommas(x: any) {
    if (!x && x !== 0)
    {
        return;
    }
    return parseInt(x).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function normalize(size: number, multiplier = 2) {
    const scale = (Constants.MAX_WIDTH / Constants.MAX_HEIGHT) * multiplier;
  
    const newSize = size * scale;
  
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }