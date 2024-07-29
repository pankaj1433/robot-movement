import { readFileSync } from 'fs';
import { describe, expect, test } from '@jest/globals';
import { robot } from '.';

const loadJson = (name: string, p: string) => JSON.parse(readFileSync(`${__dirname}/../examples/${name}/${p}`, 'utf8'));

describe('Given a robot', () => {
  test('should end up in correct postion', () => {
    const input = loadJson('01-walk-through', 'input.json');
    const expected = loadJson('01-walk-through', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should crash when hitting a wall', () => {
    const input = loadJson('02-error', 'input.json');
    const expected = loadJson('02-error', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should return error on invalid direction', () => {
    const input = loadJson('03-crash', 'input.json');
    const expected = loadJson('03-crash', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should handle consecutive turns', () => {
    const input = loadJson('04-consecutive-turn', 'input.json');
    const expected = loadJson('04-consecutive-turn', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should handle no movement', () => {
    const input = loadJson('05-no-move', 'input.json');
    const expected = loadJson('05-no-move', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should handle backward movement', () => {
    const input = loadJson('06-walk-backward', 'input.json');
    const expected = loadJson('06-walk-backward', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should handle backward movement with crash', () => {
    const input = loadJson('07-walk-backward-crash', 'input.json');
    const expected = loadJson('07-walk-backward-crash', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });

  test('should handle repetition in direction', () => {
    const input = loadJson('07-walk-backward-crash', 'input.json');
    const expected = loadJson('07-walk-backward-crash', 'expected.json');

    expect(robot(input)).toEqual(expected);
  });
});
