const sum = n => {
  let sum = 0;
  for(let i=0;i<=n;i++) {
    sum += i;
  }
  return sum;
}

const add = (a, b) => {
  return a + b;
}

// 模块成员的导出，最终以module.exports为准

// module.exports = {
//   sum: sum,
//   add: add
// }

// module.exports.sum = sum;

// exports.sum = sum;

// 两者不要同时使用
// 如果导出的成员比较少，可以使用exports
exports.add = add
// 如果导出的成员比较大，推荐使用module.exports
module.exports = {
  sum: sum
}
