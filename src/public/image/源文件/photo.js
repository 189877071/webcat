
const { readdir, rename } = require('fs');

const path = './photo'

readdir(path, function(err, files) {
    for(let i=0; i<files.length; i++) {
        rename(path + '/' + files[i], path + `/default${i}.jpg`);
    }
    console.log('ok');
})