module.exports = {
  apps: [
    {
      name: 'SS-S',
      instances: '1',
      script: 'pnpm compile && pnpm start',
    },
  ],
}
