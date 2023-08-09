/*
 * Timings example for using decorators on
 * methods and then pulling each into another
 * class method using the metadata.
 *
 * This example should help us do what the 
 * really are trying to do with the HostListener
 * decorator in ng.
 */


import { timing, logTimings, important } from './timings-decorators';

/**
 * Function to easily add a delay.
 */
const delay = <T>(time: number, data: T): Promise<T> => 
    new Promise((resolve) =>
        setTimeout(() => {
            resolve(data);
        }, time)
);


/**
 * Demonstration class for recording perf timings
 * and displaying them using ts decorators.
 */
@logTimings
class Users {
    @timing()
    async getUsers() {
        return await delay(1000, []);
    }

    @timing()
    async getUser(@important id: number) {
        return await delay(50, { id: `user:${id}` });
    }
}

(async function() {
    const users = new Users();
    
    const user = await users.getUser(22);
    console.log(`Got ${JSON.stringify(user)}`);

    await users.getUser(42);

    await users.getUsers();

    // @ts-ignore
    users.printTimings();
})();




