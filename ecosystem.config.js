module.exports = {
  apps: [
    {
      name: 'SS-S',
      port: '4000',
      instances: '1',
      script: 'pnpm compile && pnpm start',
    },
  ],
}
