# SchoolConnect

## Project URL

[https://schoolconnect.tech](https://schoolconnect.tech
) 

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 

## Project Description

School Connect is an online education platform where schools can interact with their students. 

We have three main features, including video study rooms, online classrooms and a volunteer board.

### Study Rooms
A place where students from different schools can study together. We implemented a video chat with screen sharing. We also have a collaborative whiteboard that students can do work on.

### Online Classrooms
---add here---

### Volunteer Board
---add here--- 





## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

`Technolgoies Used: React, Apollo GraphQL, Express, Socket.IO, simple-peer, MongoDB, MUI, react-sketch-canvas, Nodemailer, Mailgun and the Google Maps API.`

### Backend
On the backend, we use apollo-server-express to run our GraphQL server using Express. We also have a GET endpoint to retrieve student assignment submissions.

Both GraphQL and Socket.IO are run on the same server. A single express-session is shared between GraphQL and Socket.IO for authentication.

To send account verification and password reset emails we Nodemailer with Mailgun.

### Frontend
Our React frontend uses React Router for client side routing. Most of our components are from the MUI library. 

The video study rooms use simple-peer to share video streams between students. The signal is first sent to the other students in the room using Socket.IO, so the peers can establish a connection. 

The whiteboard itself is a third-party component called [react-sketch-canvas](https://www.npmjs.com/package/react-sketch-canvas), but we used Socket.IO to make it collaborative.

---Add about volunteer board and classrooms---



## Deployment

Our application is deployed to a Digital Ocean VM with Docker, nginx and acme-companion to handle our SSL certificate.

We have also have continuous deployment using Github Actions.
If our frontend or backend is modified when pushing to main, our auto deployment action runs. It publishes each of them to the Github Container Registry. Then a deployment action goes into our VM, pulls, builds and runs our containers using ssh-action. All of our sensitive data is stored in Github secrets and we pass them into the containers as environment variables. A lot of the code is based off of lab 10, as our project has a similar structure. 


## Maintenance

We connected our GraphQL server to Sentry.io for error tracking. Anytime an error happens, it is logged in Sentry. We can also see how many resources our VM is using on Digital Ocean.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Video Chat
	
	There were a lot of different edge cases to handle. For example, streams would sometimes be duplicated or the room participant limit wouldn't work if too many people join at the same time. 

2. Account System

	We have three different types of accounts (student, teacher, school). Each of them have different versions of pages, so it was hard to manage all of them.


3. Email Verification

	Our domain is blacklisted by UofT, so it was difficult to send emails to a UofT address. Certain words are also blacklisted by UofT including the word "account", which we couldn't use in our account verification email. 

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 
