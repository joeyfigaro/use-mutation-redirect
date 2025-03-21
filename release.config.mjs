export default {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'beta', channel: 'beta', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'release/*.tgz',
      },
    ],
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
  ],
};
