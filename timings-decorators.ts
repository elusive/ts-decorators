import { performance } from "perf_hooks";
import "reflect-metadata";


const importantMetadataKey = Symbol("required");

interface HasTimings {
    __timings: any[]
}


export function logTimings<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        __timings: any[] = [];
        printTimings = () => {
            console.log(this.__timings);
        }
    };
}


export function timing() {
    return function (
        target: any, 
        propertyKey: string, 
        descriptor: PropertyDescriptor
    ) {
        const value = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            const start = performance.now();
            const out = await value.apply(this, args);
            const end = performance.now();
           
            const prms: unknown[] = [];
            let importantParameters: number[] = Reflect.getOwnMetadata(
                    importantMetadataKey, 
                    target, 
                    propertyKey);
            if (importantParameters) {
              for (let parameterIndex of importantParameters) {
                prms.push(arguments[parameterIndex]); 
              }
            }         

            if ((this as HasTimings).__timings) {
                (this as HasTimings).__timings.push({
                    method: propertyKey,
                    time: end - start,
                    prms
                });
            } else {
                console.log(end - start);
            }

            return out;
        }
    }
}

/**
 * Decorator to mark a parameter as important to be logged.
 */
export function important(
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number
) {
    let existingImportantParameters: number[] = 
        Reflect.getOwnMetadata(importantMetadataKey, target, propertyKey) || [];
    existingImportantParameters.push(parameterIndex);
    Reflect.defineMetadata(
        importantMetadataKey,
        existingImportantParameters,
        target,
        propertyKey
    );
}
