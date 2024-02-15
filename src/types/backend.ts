export type GameState = {
  inventoryItems: {
    name: string;
    quantity: number;
    img: string;
  }[];
  stats: {
    // Out of 100.
    health: number;
    mana: number;
    speed: number;
    strength: number;
  };
};