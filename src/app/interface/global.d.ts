/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
    namespace NodeJS {
        interface Global {
            myGlobalObject: {
                io: any;
                notify: any;
            };
        }
    }
}

export {};
