export const randomIntBetween = (min: number, max: number) =>{
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export const capitalize = (string?: string) =>
	!string ? '' :string.charAt(0).toUpperCase() + string.slice(1);

export const formatNumber = (number: number | string) => {
    if (parseInt(number.toString()) < 10) return '0' + number
    return number
}
