// abstract - typescipt에만 있음
abstract class Department {
    //   private readonly id: string;
    //   private name: string;

    static fiscalYear = 2021;
    protected employees: string[] = [];

    // 약식 초기화
    // js에는 private 키워드가 없다. ES2019에서는 #를 붙여 private filed를 나타냄.
    // readonly는 타입스크립트에만 있다.
    constructor(private readonly id: string, private name: string) {
        // this.name = name;
        // console.log(this.fiscalYear); Can't access.
        console.log(Department.fiscalYear); // OK
    }

    static createEmployee(name: string) {
        return { name };
    }

    describe() {
        console.log(`Id: ${this.id} Department: ${this.name}`);
    }

    // Department class의 인스턴스에서만 호출 가능하게 this 명시
    describe2(this: Department) {
        console.log("Department: " + this.name);
    }

    abstract describe3(this: Department): void;

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployee() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    constructor(id: string, public admins: string[]) {
        super(id, "IT"); // super 먼저 호출해야 한다.
    }

    describe3(this: Department): void {}
}

class HumanDepartment extends Department {
    private lastReport: string;
    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error("No report found");
    }
    set mostRecentReport(text: string) {
        if (!text) throw new Error("Please pass in a valid text");
        this.addReport(text);
    }

    private static instance: HumanDepartment;

    // private constructor & singleton
    private constructor(id: string, private reports: string[]) {
        super(id, "Human & Resource");
        this.lastReport = reports[0];
    }

    static getInstance() {
        if (HumanDepartment.instance) {
            return this.instance;
        }
        this.instance = new HumanDepartment("id", []);
        return this.instance;
    }

    // override
    addEmployee(employee: string): void {
        if (employee === "Max") return;
        this.employees.push(employee);
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReport() {
        console.log(this.reports);
    }

    describe3(this: Department): void {}
}

/*

// abstract class can be instance
const acc = new Department("id", "accounting"); 
console.log(acc);
acc.describe(); // Department: accounting

const copy = { describe: acc.describe, describe2: acc.describe2 };
copy.describe(); // Department: undefined
// copy.describe2(); // Error!

const copy2 = { name: "dummy", describe: acc.describe, describe2: acc.describe2 };
copy.describe(); // Department: undefined
// copy2.describe2(); // Error!

acc.addEmployee("Max");
acc.addEmployee("Manu");
// acc.employees[2] = "Anna"; // Bad...
acc.printEmployee();

*/
const it = new ITDepartment("id2", []);
it.addEmployee("Kim");
it.addEmployee("Lee");
it.printEmployee();

// const hr = new HumanDepartment("id3", []);
const hr = HumanDepartment.getInstance();
hr.addReport("blahblah");
hr.printReport();
hr.addEmployee("Max");
hr.addEmployee("Nana");
hr.printEmployee();

hr.mostRecentReport = "wow!"; // setter 호출
console.log(hr.mostRecentReport); // getter 호출

const employee1 = Department.createEmployee("Max");
console.log(employee1, Department.fiscalYear);
