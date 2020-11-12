# UMId-Apps 

<a href="https://gitmoji.carloscuesta.me">
  <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square" alt="Gitmoji">
</a>

## Padronização de Desenvolvimento
<p align="center">
  <img width="100" height="100" src="https://avatars2.githubusercontent.com/u/58614957?s=400&u=d133ba2f65c51ecb72cdf6753ab378b77fef46a4&v=4">
</p>

No intuito de proporcionar uma organização aos repositórios e haver uma uniformidade na forma do trabalho nestes. A equipa The Order of Code (TOC) optou adotar padronização na gestão dos fluxo de desenvolvimento :

1. [Documentação]()
2. [Branchs](#branchs);
3. [Commits](#commits);
4. [Issue](#issue).

## Documentação:
Deve-se documentar a configuração do ambiente e possíveis problemas e suas respectivas soluções. Para facilitar a configuração do ambiente de desenvolvimento para outros da equipa e otimizar o tempo para solucionar um possível problema que apareça mais de uma vez.

## Branchs:

Iremos adotar o fluxo de branchs baseado no Workflow Design: Git Flow o qual foi publicado e popularizado por Vincent Driessen na nvie. O fluxo de trabalho Gitf low define um modelo de ramificação projetado em torno das publicações de versões do projeto. Isso nos proporciona um maior gerenciamento do projeto. 


<p align="center">
  <img width="450" height="250" src="https://iamchuka.com/content/images/2018/05/gitflowimage.png">
</p>

### Descrição das Branchs
| Só existe duas branchs as quais são fixas a branch master aonde é rotulado a versão do projeto em produção e branch develop, em cima desta que é feito todo desenvolvimento.


- [x] **Master:** 
  
Branch de produção, o codigo que está aqui é correspondente ao da versão do produto até então desenvolvido.
   
1.  O versionamento deve seguir a seguinte estruturação **v[x].[y].[w]** = v0.1.0;
  
2.  O **v** referente a versão, o **y** é correspondente cada vez que o código for dado merge a master incrementa-se mais um. Quando este valor atingir 10 valores reinicia o **y** e acresenta-se mais um no **x**. O **w** representa a quantidade de vezes as quais utilizou-se da branch Hotfix.
  

- [ ] **Hotfix:** 
     - Branch criada quando ocorre um erro no código que está em produção e esse não pode esperar uma nova release para corrí-lo. Uma Hotfix ao corrigir o erro dar-se merge na Master e na Devolop, em seguida seu tempo de existência acaba.
  
    
  
- [x] **Develop:** 
  - branch da qual irá ser a base para desenvolvimento do projeto.
  
- [ ] **Feature:**  

Para desenvolver uma nova funcionalidade:

  1.  São criadas apartir da Develop seguindo a seguinte nomeclatura feature/[ nome da funcionalide];
   
  2.  Ao finalizar essa funcionalidade deve-se testar;
   
  3.  Tudo ok na etapa anterior dar-se merge a Develop;
     
  4. Deleta-se a branch feature criada.
   
  
- [ ]  **Realease:**
  
É criada apartir da develop, quando se tem um junto de features das quais deseja-se testar:
  
1. Colaca-se no nome dessa branch da seguinte forma **release/v[X.Y.W]** . De acordo com o que foi abordado no ponto 2 da branch master;

2. Uma vez testada, todas as features, deve-se fazer merge com a master finalizando assim o ciclo de vida da release.
    

## Commits:

<img align="left" src="https://cloud.githubusercontent.com/assets/7629661/20073135/4e3db2c2-a52b-11e6-85e1-661a8212045a.gif" width="150" height="100" /> 

Para haver uma uniformidade nos commits e entendermos do que se trata cada commit feito no projeto, iremos utilizar o Gitmoji.

Depois de clonar os repositórios, os quais irão trabalhar. Para usar o gitmojis neles deve instalar o gitmoji-cli. Com seguinte comando dentro do repositório local:

```bash
 npm i -g gitmoji-cli
```

Logo após a instalação, dá o comando a seguir para criar um hook. Desta forma, sempre que for fazer git commit o terminal chamará o gitmoji.

```bash
 gitmoji init -i
```


**Quando for fazer commit:**

Agora quando for fazer commit basta digitar git commit e apertar enter e aprecerá as seguintes telas:

1. Escolhe a mensagem que representa aquele commit e aperta enter. Escolhe o que esse commit representa tens diversas categorias:
   
<p align="center">
  <img width="500" height="150" src="https://miro.medium.com/max/996/1*xk6ZOkjbi6S4jExb_ivY9A.png">
</p>

1. Deve-se escrever um titulo iniciado por um verbo que expresse uma ação. Logo em seguida será solicitado uma mensagem para descrever aquele commit.
   
<p align="center">
  <img width="500" height="150" src="https://miro.medium.com/max/1006/1*HuyRn2Ivr6PShE6wHt8d3w.png">
</p>


## Issue

Toda issue encontrada no projeto regista-se no repositório e quando resolvida deve ser fechada  atráves de um commit. Tutorial para utilizar palavras chaves para isso [aqui](https://docs.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords).



