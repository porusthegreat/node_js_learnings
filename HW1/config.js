//export environment variables
var environments = {};

//stagimng environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 4000,
  'envName' : 'staging'
};

//production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 6000,
  'envName' : 'production'
};

//Determine environment from commandline args
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'
    ? process.env.NODE_ENV.toLowerCase() : '';

//Default to staging or choose given environment
var environmentToExport = typeof(environments[currentEnvironment]) == 'object'
    ? environments[currentEnvironment] : environments.staging;

//export current env
module.exports = environmentToExport;
