// game.test.js
const { Ship, Gameboard, Player } = require('./battleship');

describe('Ship', () => {
  test('should correctly record hits and determine when sunk', () => {
    const ship = new Ship('Destroyer', 3);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.hits).toBe(1);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(3);
    expect(ship.isSunk()).toBe(true);
  });
});

describe('Gameboard', () => {
  let board;
  let ship;

  beforeEach(() => {
    board = new Gameboard();
    ship = new Ship('Cruiser', 3);
  });

  test('should place ship on board if within bounds', () => {
    board.placeShip(ship, 0, 0, 'horizontal');
    // Check that the ship occupies the correct grid cells.
    for (let i = 0; i < ship.length; i++) {
      expect(board.grid[0][i]).toBe(ship);
    }
    expect(board.ships).toContain(ship);
  });

  test('should throw error if ship placement is out of bounds', () => {
    expect(() => {
      board.placeShip(ship, 0, 8, 'horizontal');
    }).toThrow("Ship placement is out of bounds!");
  });

  test('receiveAttack should return "hit" and increase ship hits', () => {
    board.placeShip(ship, 1, 1, 'vertical');
    const result = board.receiveAttack(1, 1);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test('receiveAttack should return "miss" when no ship is present', () => {
    const result = board.receiveAttack(5, 5);
    expect(result).toBe("miss");
    expect(board.grid[5][5]).toBe("X");
    expect(board.missedAttacks).toContainEqual([5, 5]);
  });

  test('allShipsSunk should return true only when all ships are sunk', () => {
    board.placeShip(ship, 2, 2, 'horizontal');
    // Initially, the ship is not sunk.
    expect(board.allShipsSunk()).toBe(false);
    // Hit the ship three times.
    board.receiveAttack(2, 2);
    board.receiveAttack(2, 3);
    board.receiveAttack(2, 4);
    expect(ship.isSunk()).toBe(true);
    expect(board.allShipsSunk()).toBe(true);
  });
});

describe('Player', () => {
  let player1, player2, ship;

  beforeEach(() => {
    player1 = new Player("Alice");
    player2 = new Player("Bob");
    ship = new Ship('Submarine', 2);
    player2.gameboard.placeShip(ship, 0, 0, 'horizontal');
  });

  test('attack method should return proper hit message', () => {
    const message = player1.attack(player2, 0, 0);
    expect(message).toBe("Alice attacked your ship and it was a hit");
    // Verify that ship was hit.
    expect(ship.hits).toBe(1);
  });

  test('attack method should return proper miss message', () => {
    const message = player1.attack(player2, 5, 5);
    expect(message).toBe("Alice attacked your ship and it was a miss");
    // Check that the position is marked as missed.
    expect(player2.gameboard.grid[5][5]).toBe("X");
  });

  test('hasLost should return true when all ships are sunk', () => {
    // Sink the ship.
    player2.gameboard.receiveAttack(0, 0);
    player2.gameboard.receiveAttack(0, 1);
    expect(ship.isSunk()).toBe(true);
    expect(player2.hasLost()).toBe(true);
  });
});
