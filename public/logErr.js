const { readdir, stat, appendFile, writeFile } = require('fs');

const { logPath, logSize} = require('./config');

module.exports = function(data) {
    
    // [127.0.0.1] --- [2017-05-25T04:10:58.751Z] --- [浏览器信息] --- [url] --- [错误原因]

    const str = `[${data.ip ? data.ip : 'xxx.xxx.x.x'}] --- [${data.date ? data.date : (new Date()).toString()}] --- [${data.url ? data.url : '****'}] --- [${data.browser ? data.browser : '*****'}] --- [${data.err}]\n`;
   
    readdir(logPath, (err, files) => {
        
        if (err) return;
         
        if (files.length < 1) {
            writeFile(logPath + '0.log', str);
            return;
        }

        stat(logPath + files[files.length - 1], function (err, stats) {
            
            if (err) return;

            if (stats.size < logSize) {
                appendFile(logPath + files[files.length - 1], str);
            }
            else {
                writeFile(logPath + files.length + '.log', str);
            }

        })
    })
}
