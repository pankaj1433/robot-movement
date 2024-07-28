import type { InputData } from './types';
import readJson from './helper/readJson';

import Robot from './Robot';

const main = async () => {
  try {
    const input: InputData = await readJson<InputData>();

    const robotIns = new Robot(input);
    const result = robotIns.execute()

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

main();
