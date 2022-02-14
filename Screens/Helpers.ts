export function numberWithCommas(x: number) {
    if (!x)
    {
        return;
    }
    return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}