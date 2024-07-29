export type Heading = 'north' | 'south' | 'east' | 'west';
export type Directions = 'forward' | 'left' | 'right' | 'backward';

export type DirectionExtended = `${Directions}(${number})` | Directions

export type Coordinates = {
  x: number;
  y: number;
};

export type Arena = {
  corner1: Coordinates;
  corner2: Coordinates;
};

export type InputData = {
  arena: Arena;
  location: Coordinates;
  heading: Heading;
  directions: DirectionExtended[];
};

// Response Types.
export type Status = 'ok' | 'error' | 'crash';

export type Response = {
  status: Status;
  location: Coordinates;
  heading: Heading;
  path: Directions[];
};
