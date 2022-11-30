const core = require('@actions/core');
const fs = require('fs')
const path = require('path')
const admZip = require('adm-zip');

try {
    const folder = core.getInput('folder',{required: true});
    const insert_date = core.getInput('insert-date');
    let name = core.getInput('archive-name') + '.zip';

    core.info(`input archive-name: ${name}`)

    const archiveName = getArchiveName(folder, name, insert_date);
    const archiveFullPath = getArchiveFullPath(archiveName);

    if(folder !== '' && folder !== undefined){
       let zip = new admZip();
       zip.addLocalFolder(folder);
       zip.writeZip(archiveFullPath)

       if (fs.existsSync(archiveFullPath)) {
        core.setOutput('archive-path', archiveFullPath)
        core.setOutput('archive-name', archiveName)
        core.info(`archive-path: ${archiveFullPath}`)
        core.info(`archive-name: ${archiveName}`)
     }
    }

} catch (error) {
  core.setFailed(error.message);
}

function getArchiveName(folder, name, insert_date){
    let archiveName = ''
    if (fs.existsSync(folder)){
        const folderName = path.basename(folder);
        if(name === undefined){
            archiveName = folderName;
        }else{
            archiveName = name
        }

        if(insert_date){
            const date = getFormattedDate();
            if(archiveName.includes('date')){
                archiveName = archiveName.replace('date', date);
            }
            else{
                const parts = archiveName.split('.');
                if(parts.length > 0){
                    parts[0] = parts[0] + "." + date
                }
                archiveName = parts.join('.')

            }
        }
    }
    core.info(`getArchiveName: ${archiveName}`)
    return archiveName;
}

function getArchiveFullPath(name){
    const resolved = path.resolve('/');
   return path.join(resolved, name)
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