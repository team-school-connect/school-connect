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
Teachers can create their own classrooms for students to join via a code. Announcements can be made by the teacher to be shared with everyone in the class. Teachers also have the option to create assignments with due dates.
Students can upload their work and teachers can download and view their submissions.

### Volunteer Board
Teachers can post volunteer positions which includes relevant information about the position such as description, location, organization etc. The positions posted by the teacher will be visible to all students. Both students and teachers can view the positions and see all relevant information. There is also a map that the user can look at to see where the position is located.


## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

`Technolgoies Used: React, Apollo GraphQL, Express, Socket.IO, simple-peer, MongoDB, MUI, react-sketch-canvas, Nodemailer, Mailgun and the Google Maps API.`

### Backend
On the backend, we use apollo-server-express to run our GraphQL server using Express. We also have a GET endpoint to retrieve student assignment submissions for teachers.

Both GraphQL and Socket.IO are run on the same server. A single express-session is shared between GraphQL and Socket.IO for authentication.

To send account verification and password reset emails we Nodemailer with Mailgun.

Uploading files through GraphQl was done through the [graphql-upload](https://www.npmjs.com/package/graphql-upload) library which enables GraphQL multipart requests. Student submissions are stored locally on the VM. The path to the student's submission is stored in MongoDB.

### Frontend
Our React frontend uses React Router for client side routing. Most of our components are from the MUI library. 

The video study rooms use simple-peer to share video streams between students. The signal is first sent to the other students in the room using Socket.IO, so the peers can establish a connection. 

The whiteboard itself is a third-party component called [react-sketch-canvas](https://www.npmjs.com/package/react-sketch-canvas), but we used Socket.IO to make it collaborative.

The volunteer board also uses MUI components to diplay a DataGrid of all the volunteers positions. Each of the positions can be viewed in detail on a separate page. The Paper component is used to display the position details in a simplistic and clean manner. There is also google maps integration which displays a map with the positon location. This was done using the Maps JavaScript API and Geocoding API from Google Cloud Platform. To create a new position, there is a Formik form. The form is validated using Yup. For the location field, we also have autocomplete functionality using the Places API from Google Cloud Platform.

The assignments feature was created with some components from MUI. The Cards component was used for showing the assignment info for students. The Datagrid component is used to show a record of student submissions in a compact way. The teacher can sort by email or submission time. 

## Deployment

Our application is deployed to a Digital Ocean VM with Docker, nginx and acme-companion to handle our SSL certificate.

We have also have continuous deployment using Github Actions.
If our frontend or backend is modified when pushing to main, our auto deployment action runs. It publishes each of them to the Github Container Registry. Then a deployment action goes into our VM, pulls, builds and runs our containers using ssh-action. All of our sensitive data is stored in Github secrets and we pass them into the containers as environment variables. A lot of the code is based off of lab 10, as our project has a similar structure. 


## Maintenance

We connected our GraphQL server to Sentry.io for error tracking. Anytime an error happens, it is logged in Sentry. We can also see how many resources our VM is using on Digital Ocean.

To track the google maps API usage, error rate and latency we use the Google Cloud Platform metrics dashboard.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Video Chat
	
	There were a lot of different edge cases to handle. For example, streams would sometimes be duplicated or the room participant limit wouldn't work if too many people join at the same time. 

2. Account System

	We have three different types of accounts (student, teacher, school). Each of them have different versions of pages, so it was hard to manage interactions between all of them.


3. Email Verification

	Our domain is blacklisted by UofT, so it was difficult to send emails to a UofT address. Certain words are also blacklisted by UofT including the word "account", which we couldn't use in our account verification email. 

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

### Yusuf Khan
- Video Chat (Everything)
- Whiteboard Socket.IO integration
- Classroom Listing and Announcement Pages and Forms (Frontend)
- Home Page
- Deployment
- Account email verification
- Account password reset
- Left navigation bar for all pages
- Sentry.io Error Tracking

### Rakshit Patel
- Volunteer Board (Everything)
- Google Maps Integration
- Login/Signup (Frontend)
- Setup Apollo (Frontend)

### Raymond Ma
- Setup Apollo GraphQL (Backend)
- Accounts (Everything except verification)
- Classrooms
	- Backend for everything
	- Frontend for assignments


# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 
