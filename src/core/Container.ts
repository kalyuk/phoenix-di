import 'reflect-metadata';

export class Container {
    private static classMap: Map<string, Function> = new Map();
    private static containerMap: Map<string, Container> = new Map();

    private instanceMap: Map<string, Function> = new Map();

    public static register = (name: string, Class: Function) => {
        Container.classMap.set(name, Class);
    }

    public static remove(name: string){
        this.containerMap.delete(name);
    }

    public static getContainer(name: string): Container {
        if (!Container.containerMap.has(name)) {
            Container.containerMap.set(name, new Container())
        }

        return Container.containerMap.get(name)
    }

    public get = (name: string) => {
        if (!Container.classMap.has(name)) {
            throw new Error(`Class "${name}" not found`);
        }

        if (!this.instanceMap.has(name)) {
            const options = Reflect.getMetadata('container:options', Container.classMap.get(name));
            if (options.type === 'singletone') {
                this.instanceMap.set(name, this.createInstance(name))
            } else {
                return this.createInstance(name);
            }
        }

        return this.instanceMap.get(name);
    }

    private createInstance = (name: string): any => {
        const Instance: any = Container.classMap.get(name);
        const instance =  new Instance();
        instance.___container___ = this;
        const onInit = Reflect.getMetadata('container:onInit', Instance) || [];

        if(onInit){
            onInit.forEach((key: string) => {
                instance[key]();
            })
        }
        return instance;
    }

}