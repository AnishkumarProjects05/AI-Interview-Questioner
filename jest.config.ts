import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config-js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    modulePathIgnorePatterns: [
        '<rootDir>/Folonite-resume/',
        '<rootDir>/.next/',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '<rootDir>/Folonite-resume/',
        'test-openrouter\\.js$',
        'test-smtp\\.js$',
        'test-models\\.js$',
        'test-json-parsing\\.js$',
    ],
    testMatch: [
        '<rootDir>/testing/**/*.test.[jt]s?(x)',
        '<rootDir>/**/__tests__/**/*.test.[jt]s?(x)',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
