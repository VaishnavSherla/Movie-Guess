export default function getRandomOutput(str) {
  const n = str.length;
  let count;

  if (n <= 5) {
      count = 1;
  } else if (n <= 10) {
      count = 3;
  } else if (n <= 15) {
      count = 6;
  } else if (n <= 20) {
      count = 8;
  } else if (n <= 25) {
      count = 10;
  } else {
      count = 15;
  }

  const output = new Array(n).fill(' ');

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
        output[i] = '•';
    }
  }
  while (count > 0) {
      const i = Math.floor(Math.random() * n);
      if (output[i] === ' ') {
          output[i] = str[i];
          count--;
      }
  }

  return output.join('');
}