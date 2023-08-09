/*
 * date: 8 Jul 2023
 * desc: Expirementing with typescript decorators
 *       to search for and collect types.
 */

const value: string = 'working...';

const doit = (str: string) => {
    console.log(str);
}

function main() {
    doit(value);
}
