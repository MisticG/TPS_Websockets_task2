# Projektarbete 1 - WIE18G - Create a chat with socket.io (and other functions)
We created a chat using Typescript/React and node js as our backend. We used socket.io which was one of the requirements for this project and added the following functions: 

- Created an input to add a nickname when joining a room.
- Be able to create a room with a room name and password where others can join.
- Added three "/"-commands (with at least two third party API's) in the text input.
- It's possible to see when someone is typing in real time.

# How to start the project
- ### You should have latest node --version
- You can create several rooms BUT passwords and nicknames must be unique. You can join the chosen room with a unique nickname, type the room you want to join, and use the password that was used at the creation of the room. 

### To run backend and frontend together, please write the following in the terminal

1. **$ npm install** in root

2. **$ cd frontend** and run **$ npm install**

3. **$ cd..** and run **$ npm run dev**

### After the installation you could choose to only run backend...:

1. **$ npm install**

2. **$ npm run backend**

### Or only frontend for testing: 

1. **$ cd frontend** and run **$ npm install**

2. **$ npm start** in the frontend directory
