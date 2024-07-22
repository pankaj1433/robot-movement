import type { InputData, Arena, Coordinates, Heading, Directions, Response } from './types';
import readJson from './helper/readJson';

/**
 * Function to check if the robot has run into the wall
 * @param {Coordinates} location
 * @param {Arena} arena
 * @returns {boolean}
 */
const checkIfRanIntoWall = (location: Coordinates, arena: Arena): boolean => {
  const { corner1, corner2 } = arena;

  const minX = Math.min(corner1.x, corner2.x);
  const maxX = Math.max(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxY = Math.max(corner1.y, corner2.y);

  return minX <= location.x && location.x <= maxX && minY <= location.y && location.y <= maxY;
};

/**
 * Function to move the robot in the current heading direction
 * @param {Coordinates} location
 * @param {Heading} currentHeading
 * @returns {Coordinates}
 */
const moveRobot = (location: Coordinates, currentHeading: Heading): Coordinates => {
  const newLocation = { ...location };
  switch (currentHeading) {
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
  return newLocation;
};

/**
 * Function to change the robot's direction
 * @param {Directions} direction
 * @param {Heading} heading
 * @returns {Heading}
 */
const changeDirection = (direction: Exclude<Directions, 'forward'>, heading: Heading): Heading => {
  const headings: { [key in Heading]: { left: Heading; right: Heading } } = {
    north: { left: 'west', right: 'east' },
    east: { left: 'north', right: 'south' },
    south: { left: 'east', right: 'west' },
    west: { left: 'south', right: 'north' },
  };

  return headings[heading][direction];
};

// Main robot function to process the input and move the robot
export const robot = (input: InputData): Response => {
  try {
    const { directions, arena } = input;
    let { location, heading } = input;
    const path: Directions[] = [];

    // run the direction in iteration
    const run = (direction: Directions) => {
      path.push(direction);

      if (direction === 'forward') {
        const newLocation = moveRobot(location, heading);
        if (checkIfRanIntoWall(newLocation, arena)) {
          location = newLocation;
        } else {
          throw { status: 'crash', location, heading, path };
        }
      } else if (direction === 'left' || direction === 'right') heading = changeDirection(direction, heading);
      else throw { status: 'error', location, heading, path };
    };

    directions.forEach(run);

    return { status: 'ok', location, heading, path };
  } catch (e) {
    return e as Response;
  }
};

const main = async () => {
  try {
    const input: InputData = await readJson<InputData>();
    const result = robot(input);

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

main();
