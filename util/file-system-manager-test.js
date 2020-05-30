var fs = require('fs');
var rootDir= '..';
var file_system= JSON.parse("{}")

var traverseFileSystem = function (currentPath) {
    //console.log(currentPath);
    console.log(currentPath + " - DIRECTORY");
    var last_Path= currentPath.split("/");
    if(rootDir==last_Path[last_Path.length-1])
        file_system[rootDir]=JSON.parse("{}");
    else
        Object.entries(file_system).find(([key,obj]) => obj.last_Path[last_Path.length-2])[last_Path[last_Path.length-1]]=JSON.parse("{}");
    
    console.log(file_system)
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isFile()) {
            console.log(currentFile + " - FILE");
        }
        else
            if (stats.isDirectory() && currentFile!='../node_modules') {
                traverseFileSystem(currentFile);
            }
    }
};
traverseFileSystem(rootDir);
console.log(file_system)

//<dir>/nomeDoc/v2.docx