// https://api.github.com/repos/gugabs/teste-do-ronald/forks
//Authorization token <token pessoal do git>
import linksAlunos from './linksAlunos.js';
import axios from 'axios';
import shell from 'shelljs';
import dotenv from 'dotenv';

dotenv.config();


function linkFormater(link){
    const formatedGitRepo=link.split('/');
    return {userName:formatedGitRepo[3],repoName:formatedGitRepo[4]};
}

linksAlunos.forEach(async (link)=>{
    const {userName,repoName}=linkFormater(link);
    console.log("forcando repositório...");
    try{
      await axios.post(`https://api.github.com/repos/${userName}/${repoName}/forks`,{},{headers:{
        Authorization:process.env.GIT_TOKEN
      }})

      const path=userName+"-"+repoName;
      shell.mkdir(path);
      shell.cd(path);
      shell.exec(`git clone https://github.com/${process.env.GIT_NAME}/${repoName}`);
   

      const no_delete = ['node_module','package-lock.json'];

      console.log("deletando arquivos...");
      shell.ls(repoName).forEach( (item) =>{
      
          if (!no_delete.includes(item)){
              console.log(item);
              shell.rm(repoName+'/'+item);
              shell.rm("-rf",repoName+'/'+item);
          }
    
      } )

      shell.cd(repoName);

      shell.exec(`git add .`);
      shell.exec(`git commit -m "preparando review"`);
      shell.exec(`git push `);

  
     
    }catch(e){
        console.log("ERROR"+e)
    }
    
})






