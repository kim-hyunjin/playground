/**
 * Index Type
 */
interface ErrorContainer {
    [prop: string]: string; // property는 string, value는 string
}

const errorBag: ErrorContainer = {
    email: "Not a valid email!",
    username: "Must start with a capital character!",
};
