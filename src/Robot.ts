import type { InputData, Arena, Coordinates, Heading, Directions, Response } from './types';

class Robot {
  private location: Coordinates;
  private heading: Heading;
  private directions: Directions[]
  private arena: Arena;
  private path: Directions[];

  constructor(input: InputData) {
    this.location = input.location;
    this.heading = input.heading;
    this.directions = input.directions;
    this.arena = input.arena;
    this.path = [];
  }

  /**
   * Function to check if the robot has run into the wall
   * @param {Coordinates} newLocation
   */
  private checkIfRanIntoWall = (newLocation: Coordinates): boolean => {
    const { corner1, corner2 } = this.arena;

    const minX = Math.min(corner1.x, corner2.x);
    const maxX = Math.max(corner1.x, corner2.x);
    const minY = Math.min(corner1.y, corner2.y);
    const maxY = Math.max(corner1.y, corner2.y);

    return (
      minX <= newLocation.x &&
      newLocation.x <= maxX &&
      minY <= newLocation.y &&
      newLocation.y <= maxY
    );
  }

  /**
   * Function to move the robot in the current heading direction.
   */
  private moveRobot = () => {
    const newLocation = { ...this.location };
    switch (this.heading) {
      case 'north':
        newLocation.y += 1;
        break;
      case 'south':
        newLocation.y -= 1;
        break;
      case 'east':
        newLocation.x += 1;
        break;
      case 'west':
        newLocation.x -= 1;
        break;
    }

    if (!this.checkIfRanIntoWall(newLocation)) {
      throw ({
        status: 'crash',
        location: this.location,
        heading: this.heading,
        path: this.path
      });
    }

    this.location = { ...newLocation };
  }

  /**
   * Function to change the robot's direction
   * @param {Exclude<Directions, 'forward'>} direction
   */
  private changeDirection = (direction: Exclude<Directions, 'forward'>) => {
    const headings: { [key in Heading]: { left: Heading; right: Heading } } = {
      north: { left: 'west', right: 'east' },
      east: { left: 'north', right: 'south' },
      south: { left: 'east', right: 'west' },
      west: { left: 'south', right: 'north' },
    };

    this.heading = headings[this.heading][direction];
  }

  /**
   * Function to run the robot on each direction input
   * @param {Directions} direction 
   */
  private run = (direction: Directions) => {
    this.path.push(direction);

    switch (direction) {
      case "forward":
        this.moveRobot();
        break;
      case "left":
      case "right":
        this.changeDirection(direction)
        break;
      default:
        throw {
          status: 'error',
          location: this.location,
          heading: this.heading,
          path: this.path
        };
    }
  }

  /**
   * Function to execute the robot
   * @returns {Response} response
   */
  public execute = (): Response => {
    try {
      this.path = [];

      this.directions.forEach(this.run);

      return ({
        status: "ok",
        location: this.location,
        heading: this.heading,
        path: this.path
      });
    } catch (error) {
      return error as Response;
    }
  }
}

export default Robot;
