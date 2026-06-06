/**
 * Discriminated Unions
 */

interface Bird {
    type: "bird";
    flyingSpeed: number;
}

interface Horse {
    type: "horse";
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
    switch (animal.type) {
        case "bird":
            console.log("Moving with speed: " + animal.flyingSpeed);
            break;
        case "horse":
            console.log("Moving with speed: " + animal.runningSpeed);
    }
}

moveAnimal({ type: "bird", flyingSpeed: 20 });
moveAnimal({ type: "horse", runningSpeed: 30 });
