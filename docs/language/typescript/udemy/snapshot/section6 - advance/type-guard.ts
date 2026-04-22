/**
 * Type Guard
 */
type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInfo(emp: UnknownEmployee) {
    console.log("Name: " + emp.name);
    if ("privileges" in emp) {
        console.log("Privileges: " + emp.privileges);
    }
    if ("startDate" in emp) {
        console.log("StartDate: " + emp.startDate);
    }
}

printEmployeeInfo({ name: "Namu", startDate: new Date() });

class Car {
    drive() {
        console.log("Brooong boorooong");
    }
}

class Truck {
    drive() {
        console.log("boowaaaaaaang");
    }

    loadCargo(amount: number) {
        console.log("Loading cargo ... " + amount);
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();
    //   if ("loadCargo" in vehicle) {
    //     vehicle.loadCargo(1000);
    //   }
    // class는 js에서도 제공. instanceOf로 타입을 체크할 수 있다.
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}

useVehicle(v1);
useVehicle(v2);
