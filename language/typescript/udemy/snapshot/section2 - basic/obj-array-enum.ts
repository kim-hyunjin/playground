/**
 * Object
 */

// generic object type
const person: object = {
  name: "max",
  age: 30,
};

// specific object type
const person2: {
  name: string;
  age: number;
} = {
  name: "max",
  age: 30,
};

console.log(person);
console.log(person2);

// more complex
const product: {
  id: string;
  price: number;
  tags: string[];
  details: {
    title: string;
    description: string;
  };
} = {
  id: "abc1",
  price: 12.99,
  tags: ["great-offer", "hot-and-new"],
  details: {
    title: "Red Carpet",
    description: "A great carpet - almost brand-new!",
  },
};

console.log(product);

/**
 * Array
 */

const person3 = {
  hobbies: ["Sports", "Cooking"],
};

let favoriteActivity: string[];
favoriteActivity = ["Sports"];
// favoriteActivity = "sports"; // Error!
// favoriteActivity = ['Sports', 1]; // Error!

let anyFavorite: any[];
anyFavorite = ["Sports", 1]; //OK;

for (const hobby of person3.hobbies) {
  console.log(hobby.toUpperCase());
  //   console.log(hobby.map()) // Error!
}

/**
 * Tuple
 *
 * added by typescript.
 */
const person4: {
  role: [number, string]; // tuple! role
} = {
  role: [1, "author"],
};

person4.role.push("admin"); // role is tuple.. but we can push more data...
// person4.role[1] = 10 // Error! but it prevent assing wrong value
console.log(person4);

/**
 * Enum
 *
 * added by typescript.
 */

// when javascript
const ADMIN = 0;
const READ_ONLY = 1;

const person5 = {
  role: ADMIN,
};

if (person5.role === ADMIN) {
  console.log("admin");
}

// use enum
enum Role {
  ADMIN, // = 0
  READ_ONLY, // = 1
  AUTHOR, // = 2
}

const person6 = {
  role: Role.ADMIN,
};

if (person5.role === Role.ADMIN) {
  console.log("admin");
}

enum Role2 {
  ADMIN = "ADMIN",
  READ_ONLY = 100,
  AUTHOR = "AUTHOR",
}

/**
 * ANY
 *
 * any kind of value,
 * no specific type assignment
 *
 * don't use really need to
 */
let garbageCan: any[];
garbageCan = [1, true, "trash"];
