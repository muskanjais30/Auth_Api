module.exports = {
    apps: [{
      name: 'my-user-auth-api',
      script: 'server.js', // Change this to the entry point of your Node.js application
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    }],
  };
  