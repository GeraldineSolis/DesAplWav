let tasks = [];
let currentId = 1;

module.exports = {
  tasks,
  getNextId: () => currentId++
};