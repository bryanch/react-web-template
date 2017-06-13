module.exports = (function(){
    var envName = process.env.NODE_ENV || 'dev';

    var dynamics = {
        production: {
            port: process.env.port,
            dist: 'prod'
        },
        dev: {
            port: 2020,
            dist: 'dev'
        }
    };

    if(!(envName in dynamics)){
        console.error("Could not load config for environment '" + env + "'");
    }

    var env = dynamics[envName];
    env.name=envName;

    return {
        app: {name: 'react-web-template'},
        env: env,
        dynamics: dynamics
    }
})();
