// utils/CapitalizeEachWord.js

const capitalizeEachWord = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default capitalizeEachWord;
