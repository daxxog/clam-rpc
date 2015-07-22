/* ClamRpc
 * A command line RPC client for CLAMs.
 * (c) 2015 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.ClamRpc = factory();
  }
}(this, function() {
    var clamcoin = require('clamcoin'),
        readline = require('readline'),
        yargs = require('yargs'),
        ClamRpc, argv;
        
    argv = 
        yargs
        .usage('Usage: clam-rpc -h [host] -u [username] -a [password] -p [port] -t [timeout]')
        
        .alias('h', 'host')
        .describe('h', 'RPC host to connect to.')
        .demand('h')
        .nargs('h', 1)
        
        .alias('p', 'port')
        .describe('p', 'The port to connect to.')
        .default('p', '30174')
        .nargs('p', 1)
        
        .alias('u', 'user')
        .alias('u', 'username')
        .describe('u', 'RPC username.')
        .default('u', 'clamrpc')
        .nargs('u', 1)
        
        .alias('a', 'auth')
        .alias('a', 'pass')
        .alias('a', 'password')
        .describe('a', 'RPC password.')
        .demand('a')
        .nargs('a', 1)
        
        .alias('t', 'timeout')
        .describe('t', 'Connection timeout in milliseconds.')
        .default('t', '30000')
        .nargs('t', 1)
        
        .help('help')
        .argv;
    
    ClamRpc = function() {
        this.client = new clamcoin.Client({
            host: argv.host,
            port: argv.port,
            user: argv.user,
            pass: argv.pass,
            timeout: argv.timeout
        });
        
        this.client.cmd('help', function(err, help) {
            console.log(err, help);
        });
        
        /*this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });*/
    };
    
    return ClamRpc;
}));
