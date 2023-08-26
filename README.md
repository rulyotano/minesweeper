# Minesweeper
Minesweeper application (for academical propose). This project started as only a test web built on ReactJs, but now I wanted to integrate it into a more complete web ecosystem, taking into account web apis, databases, reverse proxy, load balancing and other architectural stuff. 

# Goal
Create a sample Minesweeper web app, developed following CI/CD principles. But also using new learned architectural principles like React Swarm, Github pipelines, reverse proxies and so on...

# Check the progress
Visit and play [minesweeper.rulyotano.com](https://minesweeper.rulyotano.com/mines-sweeper)

![Minesweeper image](/images/mineminesweeper-redux.gif?raw=true "My Minesweeper Redux")

# Architectural decision
![Architecture](/images/minesweeper-architecture-01.png?raw=true "Architecture")

COMING SOON: More description...

# Deployment Flow
![Deployment Flow](/images/minesweeper-deployment-flow-01.png?raw=true "Deployment Flow")

[Deployment FLow](https://www.figma.com/file/V7yEaOJgky1BMXSKgTkUkp/Welcome-to-FigJam?type=whiteboard&node-id=0%3A1&t=bBxxsbG32YUhfXEe-1)

# Instruction to run in local with docker compose
- Install docker, it can be dockerd and docker cli (docker deamon) or with docker desktop.
- Create the redis volume: `redis_storage`. Command: `docker volume create redis_storage`
- Go to the `/src` directory and run `docker compose up`. That will build and run the project.
- Now you should be able to access to `http://web.minesweeper.localhost`
**NOTE** Port 80 and 8080 should be free. If you want to use other ones you will need to update the `docker-compose.yml` file.