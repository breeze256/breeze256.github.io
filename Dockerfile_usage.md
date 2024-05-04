# Dockerfile Usage

### Step 1: Build the image
`docker build -t breeze256-blog:latest .`

### Step 2: Run the image
`docker run -it -v YOUR_REPO_PATH:/docs -v YOUR_SSH_PATH:/ssh breeze256-blog /bin/ash`

### Addtiton 1: Enter the container
`docker exec -it CONTAINER_NAME /bin/ash`

### Addition 2: Install dependences
excute `instl_deps.sh` under the /docs path.
