module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'models/**/*.js',
        'controllers/**/*.js',
        'utils/**/*.js',
        '!**/__tests__/**'
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    testMatch: ['**/__tests__/**/*.test.js']
};
