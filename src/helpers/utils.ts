import { formatUnits } from 'ethers';

export const parse = (value: any) => {
    if (value === undefined) return '0';
    return formatUnits(value, 18);
}