// Class to represent the ingredient model and its behavior
export class Ingredient {
  name: string;
  quantity: number;
  unit: string;

  constructor(name: string, quantity: number, unit: string) {
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
  }

  setName(name: string): void {
    this.name = name;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  setUnit(unit: string): void {
    this.unit = unit;
  }

  toJSON(): object {
    return {
      name: this.name,
      quantity: this.quantity,
      unit: this.unit,
    };
  }
}
