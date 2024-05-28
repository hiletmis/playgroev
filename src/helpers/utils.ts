import { formatUnits } from 'ethers';

export const parseETH = (value: any) => {
    if (value === undefined) return '0';
    return formatUnits(value, 18);
}

export const COLORS = {
    app: '#f2f2f2',
    appDarker: '#ffffff',
    bg: '#ffffff',
    table: "blue.900",
    info: "gray.500",
    main: "#ffffff",
    button: "blue.700",
    buttonDisabled: "gray.800",
    caution: "yellow.700",
};

export const copy = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(err => { console.error('Failed to write clipboard contents: ', err) });
    } else {
        alert("Clipboard API not available");
    }
}

export const trimHash = (hash: string) => {
    return hash.substring(0, 6) + "..." + hash.substring(hash.length - 4);
}