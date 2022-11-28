const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')
const path = require('path')

const admZip = require('adm-zip');
const { GitHub } = require('@actions/github/lib/utils');

try {
    const folder = core.getInput('folder',{required: true});
    const insert_date = core.getInput('insert-date');
    let name = core.getInput('archive-name') + '.zip';

    const archiveName = getArchiveName(folder, name, insert_date);
    const archiveFullPath = getArchiveFullPath(folder, archiveName);

    console.log('archiveFullPath: ' + archiveFullPath)
    
    if(folder !== '' && folder !== undefined){
       let zip = new admZip();
       zip.addLocalFolder(folder);
       zip.writeZip(archiveFullPath)

       if (fs.existsSync(archiveFullPath)) {
        console.log('ddddddd Zip archive was created at: ' + archiveFullPath)
        core.setOutput('archive-path', archiveFullPath)
     }
    }

} catch (error) {
  core.setFailed(error.message);
}

function getArchiveName(folder, name, insert_date){
    let archiveName = ''
    if (fs.existsSync(folder)){
        const folderName = path.dirname(folder);
        console.log('getArchiveName folderName 1 ' + folderName)
        if(name === undefined){
            archiveName = folderName;
        }else{
            archiveName = name
        }

        console.log('getArchiveName archiveName 2 ' + archiveName)

        if(insert_date){
            const date = getFormattedDate();
            console.log('getArchiveName date ' + date)
            if(archiveName.includes('date')){
                archiveName = archiveName.replace('date', date);
            }
            else{
                archiveName = archiveName + date;
            }
        }
        console.log('getArchiveName archiveName 3 ' + archiveName)
    }

    return archiveName;
}

function getArchiveFullPath(name){
    path.resolve('/' + name + '.zip')
}

function getFormattedDate(){
    const date = new Date().toLocaleString()
    let formatted = ''
    const parts = date.split(',');
    if(parts.length > 0){
        const reg = new RegExp('/', 'g')
        formatted = parts[0].replace(reg,''); 
    } 
    return formatted;
}