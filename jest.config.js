module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@expo-google-fonts/.*|react-native-svg))',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
    {
      displayName: 'integration',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/tests/integration/**/*.test.tsx'],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@expo-google-fonts/.*|react-native-svg))',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
  ],
};
