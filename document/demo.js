
function upwardDir(dir) {
    dir = dir.replace(/\\/g, '/').split('/');
    dir.pop();
    return dir;
}

upwardDir(__dirname)