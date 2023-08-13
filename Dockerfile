# Use an official Node.js runtime as a parent image
FROM node:18.15

# Set the working directory to /app
WORKDIR /app


# Copy the current directory contents into the container at /app
COPY . /app

# run ls
RUN ls
# Install dependencies for the backend
RUN npm install

# npm run build 
RUN npm run build

# Install dependencies for the frontend
RUN npm install --prefix frontend

# npm run build frontend
RUN npm run build --prefix frontend





# Expose port 5173 for the application
EXPOSE 5173

# run npm start and npm run preview --prefix frontend 
CMD ["npm", "run", "both-prod"]

# how to run
# docker build -t myapp .
# docker run -p 5173:5173 myapp