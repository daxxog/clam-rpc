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
        S = require('string'),
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
        var that = this;
        
        this.client = new clamcoin.Client({
            host: argv.host,
            port: parseInt(argv.port, 10),
            user: argv.user,
            pass: argv.pass,
            timeout: parseInt(argv.timeout, 10)
        });
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
       this.rl.setPrompt([argv.user, argv.host].join('@') + ' -> ');
       this.rl.prompt();
       
        this.rl.on('line', function(cmd) {
            var cmds = cmd.split(' '),
                cb = 
                function(err, res) {
                    if(!err) {
                        console.log(res);
                    } else {
                        console.error(err);
                    }
                    
                    that.rl.prompt();
                };
            
            switch(cmd) { //could put custom client commands here
                case 'exit':
                    that.rl.close();
                    console.log('goodbye');
                  break;
                default:
                    if(cmds.length > 1) {
                        cmds = that._parse(cmds);
                        cmds.push(cb);
                        that.client.cmd.apply(that.client, cmds);
                    } else {
                        that.client.cmd(cmd, cb);
                    }
                  break;
            }
        });
    };
    
    ClamRpc.prototype._parse = function(cmds) { //parse cmds
        return cmds.map(function(cmd) {
            if(S(cmd).isNumeric()) {
                return parseInt(cmd, 10);
            } else if(cmd === 'true') {
                return true;
            } else if(cmd === 'false') {
                return false;
            } else {
                return cmd;
            }
        });
    };
    
    return ClamRpc;
}));
