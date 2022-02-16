export function numberWithCommas(x: any) {
    if (!x && x !== 0)
    {
        return;
    }
    return parseInt(x).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}