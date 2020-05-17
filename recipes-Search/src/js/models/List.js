import uniqid from 'uniqid';


export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    // [2,5,7] splice(1,2) --> returns [5,7], original array is [2]
    // [2,5,7] slice(1,2) --> returns 7, original array is [2,5,7]
    // [2,5,7] slice(1,1)--> returns nothing!, original array is [2,5,7]
    this.items.splice(index, 1);

  }

  updateCount(id, newCount) {
    // use find() to find the element itself
    this.items.find(el => el.id === id).count = newCount;
  }
}
