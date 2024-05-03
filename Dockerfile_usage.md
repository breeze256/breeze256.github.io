# Dockerfile Usage

### Step 1: Build the image
`docker build -t breeze256-blog:latest .`

### Step 2: Run the image
`docker run -it -v /home/breeze256/breeze256.github.io:/docs -v /home/breeze256/Documents/ssh:/ssh breeze256-blog /bin/ash`

### Addtiton: Enter the container
`docker exec -it -u breeze256 CONTAINER_NAME /bin/ash`
