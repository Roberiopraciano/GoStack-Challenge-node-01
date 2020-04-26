const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();
app.use(express.json());
app.use(cors());


const repositories = [];

app.use(logRequests);


function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}]  ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}


app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  let likes=0;

  respository ={
    id: uuid(),
    title,
    url,
    techs,
    likes,
  }

  repositories.push(respository);
  response.status(200).json(respository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title,url, techs} = request.body;
  
  respositoryIndex = repositories.findIndex(repositorie => repositorie.id===id);
  if (respositoryIndex < 0) 
   {
      return response.status(400).json({ error: 'index not found' });
   }

  const repositorie ={
    id,
    title,
    url,
    techs,
    likes:repositories[respositoryIndex].likes,

  }; 
  
  repositories[respositoryIndex] = repositorie;
  
  return response.json(repositorie);

});

app.delete("/repositories/:id", (request, response) => {
  console.log(request);
  const { id } = request.params;
  const { title, url } = request.body;

  respositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'index not found' });
  }
  repositories.splice(respositoryIndex,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  

  respositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'index not found' });
  }

  const repositorie = repositories[respositoryIndex];

  repositorie.likes++;
  
  repositories[respositoryIndex] = repositorie;

  return response.json(repositorie);

});

module.exports = app;
