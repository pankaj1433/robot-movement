export default <T = unknown>(): Promise<T> => {
  const stdin = process.stdin;
  const inputChunks: Buffer[] = [];

  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', (chunk) => {
    inputChunks.push(chunk);
  });

  return new Promise((resolve, reject) => {
    stdin.on('end', () => {
      try {
        const inputJSON = inputChunks.join('');
        resolve(JSON.parse(inputJSON));
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    stdin.on('error', () => {
      reject(new Error('Error during read'));
    });

    stdin.on('timeout', () => {
      reject(new Error('Timeout during read'));
    });
  });
};
