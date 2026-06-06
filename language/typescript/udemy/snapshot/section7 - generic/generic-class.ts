/**
 * generic class
 */
class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];

    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
// textStorage.addItem(10) //error!
textStorage.addItem("Max");
textStorage.addItem("Jin");
textStorage.addItem("Hyesung");
textStorage.removeItem("Max");
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
console.log(numberStorage.getItems());

/*
 const objStorage = new DataStorage<object>();
 const max = { name: "Max" };
 objStorage.addItem(max);
 objStorage.addItem({ name: "Hamilton" });
 objStorage.removeItem(max);
 console.log(objStorage.getItems());
 */
