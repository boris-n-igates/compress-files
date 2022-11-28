const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')

const admZip = require('adm-zip');

try {
    const folder = core.getInput('folder',{required: true});
    const insert_date = core.getInput('insert-date');
    const archive_name = getArchiveName(folder, insert_date);

    if(folder !== '' && folder !== undefined){
       let zip = new admZip();
       zip.addLocalFolder(folder);
       zip.writeZip(archive_name)

       if (fs.existsSync(archive_name)) {
        console.log('ddddddd Zip archive was created at: ' + archive_name)
        core.setOutput('archive-path', archive_name)
     }
    }

} catch (error) {
  core.setFailed(error.message);
}

function getArchiveName(folder, insert_date){
    let name = core.getInput('archive-name') + '.zip';

    if(name === undefined) return folder + '.zip';
    else {
        if(insert_date){
            const formatted = getFormattedDate();
             if(name.includes('date')){
                name = name.replace('date', formatted);
             }else{
                name = name.replace('.zip', '.' + formatted + '.zip')
             }
        }
        else{
            name = folder + name;
        }
    }
    return name;
}

function getFormattedDate(){
    const date = new Date();

    const dd = date.getDate();
    const mm = date.getMonth() + 1; 
    var yyyy = date.getFullYear();

    return dd + mm + yyyy;
}