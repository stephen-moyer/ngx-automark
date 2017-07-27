import { ChangeDetectorRef, Injectable } from "@angular/core";

declare var Reflect: any;

function markPrototypeProperty(propertyName: string, targetedClass: any) {
    var created = true;
    var properties = Reflect.getMetadata("properties", targetedClass);
    if (properties == null) {
        created = false;
        properties = {};
        Reflect.defineMetadata("properties", properties, targetedClass);
    }
    if (propertyName in properties) {
        return true;
    }
    properties[propertyName] = true;
    return created;
}

function transformedPrototype(target: any) {
    return Reflect.getMetadata("properties", target) != null;
}

function updateAnonymousObject(instance: any) {
    if (instance.___autoMarkTransformed) {
        return;
    }
    instance.___autoMarkTransformed = true;
    var complexObjects = {};
    for(let key in instance) {
        let currentValue = instance[key];
        if (currentValue == 'function') {
            continue;
        }
        if (currentValue == 'object') {
            updateAnonymousObject(instance[key]);
        }
        //TODO use defineProperties.
        defineProperty(instance, key);
        instance[key] = currentValue;
    }
    defineAutoMarkProperty(instance);
}

export function AutoMark() {
	return function (targetedClass: Object, propertyName: string) {
        var justCreated = markPrototypeProperty(propertyName, targetedClass);
        decorator(propertyName, targetedClass);
        if (justCreated) {
            defineAutoMarkProperty(targetedClass);
        }
	};
}

function decorator(propertyName: string, targetedClass: any) {
    let valueProperty = '$__ac__' + propertyName;
	defineProperty(targetedClass, propertyName);
}

function defineAutoMarkProperty(target: any) {    
    Object.defineProperty(target, '___autoMark', {
            get: function () {
                return this.___autoMarkValue;
            },
            set: function (value) {
                var complexObjects = this.___autoMarkObjects || (this.___autoMarkObjects = {});
                this.___autoMarkValue = value;
                for(let key in complexObjects) {
                    let obj = complexObjects[key];
                    if (obj == null) {
                        continue;
                    }
                    obj.___autoMark = value;
                }
            }
    });
}

function defineProperty(target: any, property: string) {
    let valueProperty = '$__autoMarkValue__' + property;
    Object.defineProperty(target, property, {
            get: function () {
                return this[valueProperty];
            },
            set: function (value) {
                var complexObjects = this.___autoMarkObjects || (this.___autoMarkObjects = {});
                if (value == null) {
                    delete complexObjects[property];
                }
                if (typeof value === 'object') {
                    if (!transformedPrototype(value.constructor.prototype) &&
                        value.constructor.prototype == Object.prototype) {
                        updateAnonymousObject(value);
                    }
                    if (value.___autoMark == null) {
                        value.___autoMark = this.___autoMark;
                    }
                    complexObjects[property] = value;
                }
                this[valueProperty] = value;
                if (this.___autoMark != null) {
                    this.___autoMark.mark();
                }
            }
        });
}

@Injectable()
export class AutoMarkService {

    constructor(private cdRef: ChangeDetectorRef) {
    }

    public mark() {
        this.cdRef.markForCheck();
    }

}