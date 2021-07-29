//Authorization token <token pessoal do git>
import axios from 'axios';
import shell from 'shelljs';
import './setup.js';
import linksAlunos from './linksAlunos.js';

function  main(){
    shell.cd("..");
    linksAlunos.forEach(async (link)=>{
        const {userName,repoName}=linkFormater(link);
        console.log(`Iniciando fork do repositorio ${repoName} do aluno ${userName}...`);
        try{
          const fork = await axios.post(`https://api.github.com/repos/${userName}/${repoName}/forks`,{},{headers:{
            Authorization:process.env.GIT_TOKEN
          }})
          
          const nameRepositoryFork = fork.data.name;

          
          const path=userName+"-"+nameRepositoryFork;
          
          shell.mkdir(path);
          shell.cd(path);

          console.log(`Clonando o repositorio ${nameRepositoryFork}...`);

          shell.exec(`git clone https://github.com/${process.env.GIT_NAME}/${nameRepositoryFork}`);
          
          const no_delete = ['node_module','package-lock.json'];
    
          console.log(`deletando arquivos de ${userName} ...`);

          shell.ls(nameRepositoryFork).forEach( (item) =>{
              if (!no_delete.includes(item)){
                  shell.rm("-rf",nameRepositoryFork+'/'+item);
              }
          } )
    
          shell.cd(nameRepositoryFork);
    
          shell.exec(`git add .`);
          shell.exec(`git commit -m "code review"`);
          shell.exec(`git push `);
    
          shell.cd("..");
          shell.cd("..");
      
         
        }catch(e){
            console.log("ERROR"+e)
        }
        
    })
}
function linkFormater(link){
    const formatedGitRepo=link.split('/');
    return {userName:formatedGitRepo[3],repoName:formatedGitRepo[4]};
}

main();


