// jest.config.js
export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleFileExtensions: ["js", "jsx"],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    // ✅ Allow Jest to transform certain ESM packages (like axios)
    transformIgnorePatterns: [
        "node_modules/(?!(axios)/)"
    ],
};
