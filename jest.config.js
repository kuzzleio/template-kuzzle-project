module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
