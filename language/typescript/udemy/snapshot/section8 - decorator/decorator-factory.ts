function WithTemplate(template: string, hookId: string) {
    // this is the decorator factory, it sets up
    // the returned decorator function
    return function (constructor: any) {
        // this is the decorator
        // do something with 'target' and 'value'...
        const hookEl = document.getElementById(hookId);
        const p = new constructor();
        if (hookEl) {
            hookEl.innerHTML = template;
            const nameTag = document.createElement("h2");
            nameTag.innerHTML = p.name;
            hookEl.appendChild(nameTag);
        }
    };
}

@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
    name = "Max";

    constructor() {
        console.log("creating person object");
    }
}

// const pers = new Person();

// console.log(pers);
