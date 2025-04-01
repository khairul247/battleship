
class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
        this.hits = 0;
    }

    hit(){
        this.hits++;
    }

    isSunk(){
        return this.hits >= this.length;
    }
}

class Gameboard { //assuming the players only have one chance to click on each boxes.
    constructor() {
        this.grid = Array(10).fill(null).map(()=> Array(10).fill(null));
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(ship, x, y, orientation){

        if (this.isOutofBounds(ship, x, y, orientation)){
            throw new Error ("Ship placement is out of bounds!")
        }

        for (let i = 0; i < ship.length; i++){
            if (orientation === "horizontal"){
                this.grid[x][y+i] = ship;
            } else {
                this.grid[x+i][y] = ship;
            }
        }

        this.ships.push(ship);
    }

    isOutofBounds(ship, x, y, orientation){
        if (orientation == "horizontal"){
            return y + ship.length > 10;
        } else {
            return x + ship.length > 10;
        }
    }

    receiveAttack(x, y){
        if (this.grid[x][y] !== null){ //assuming the grid has been filled as "ship"
            this.grid[x][y].hit();
            return "hit";
        } else {
            this.grid[x][y] = 'X';
            this.missedAttacks.push([x,y]);
            return "miss"
        }
    }

    allShipsSunk () {
        return this.ships.every(ship => ship.isSunk());
    }
}

class Player {
    constructor(name){
        this.name = name;
        this.gameboard = new Gameboard();
    }

    attack(opponent, x, y){
        const result = opponent.gameboard.receiveAttack(x, y);
        return `${this.name} attacked your ship and it was a ${result}`
    }

    hasLost(){
        return this.gameboard.allShipsSunk();
    }
}
