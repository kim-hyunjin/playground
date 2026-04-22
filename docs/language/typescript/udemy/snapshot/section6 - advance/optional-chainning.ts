/**
 * Optional Chainning
 */
const fetchUserData = {
    id: "u1",
    name: "max",
    job: { title: "CEO", description: "my own company" },
};

console.log(fetchUserData?.job?.title);
