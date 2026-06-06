/**
 * Intersection Type
 */
type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    startDate: Date;
};

type EleavatedEmployee = Admin & Employee;

const e1: EleavatedEmployee = {
    name: "Nana",
    privileges: ["create-server"],
    startDate: new Date(),
};

interface Admin2 {
    name: string;
    privileges: string[];
}

interface Employee2 {
    name: string;
    startDate: Date;
}

interface EleavatedeEmployee1 extends Admin2, Employee2 {}

type EleavatedEmployee2 = Admin2 & Employee2;
