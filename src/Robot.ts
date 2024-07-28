import type { InputData, Arena, Coordinates, Heading, Directions, Response, Obstacle } from './types';

class Robot {
  private location: Coordinates;
  private heading: Heading;
  private directions: Directions[]
  private arena: Arena;
  private path: Directions[];
  private obstacles: Obstacle[];
  private history: { location: Coordinates; heading: Heading }[]

  constructor(input: InputData) {
    this.location = input.location;
    this.heading = input.heading;
    this.directions = input.directions;
    this.arena = input.arena;
    this.obstacles = input.obstacles;

    this.path = [];
    this.history = [];
  }

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

  private checkIfRanIntoObstacle = (newLocation: Coordinates): boolean => (
    this.obstacles.some(obstacle => obstacle.x === newLocation.x && obstacle.y === newLocation.y)
  )

  private updateHistory = () => {
    this.history.push({ location: { ...this.location }, heading: this.heading });
  }

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

    if (this.obstacles.length > 0) {
      if (!this.checkIfRanIntoObstacle(newLocation)) {
        throw ({
          status: 'obstacle',
          location: this.location,
          heading: this.heading,
          path: this.path
        });
      }
    }

    this.updateHistory();
    this.location = newLocation;
  }

  private changeDirection = (direction: Exclude<Directions, 'forward' | 'undo'>) => {
    const headings: { [key in Heading]: { left: Heading; right: Heading } } = {
      north: { left: 'west', right: 'east' },
      east: { left: 'north', right: 'south' },
      south: { left: 'east', right: 'west' },
      west: { left: 'south', right: 'north' },
    };

    this.updateHistory();
    this.heading = headings[this.heading][direction];
  }

  private undo = () => {
    if (this.history.length <= 0) {
      throw ({
        status: 'can\'t undo',
        location: this.location,
        heading: this.heading,
        path: this.path
      });
    }

    const previousState = this.history.pop();
    if (previousState) {
      this.location = previousState.location;
      this.heading = previousState.heading
    }
  }

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
      case "undo":
        this.undo();
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
