/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleDirectories: ['node_modules', 'src'], // pour simplifier les imports
};
