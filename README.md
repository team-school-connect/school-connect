# SchoolConnect
## Overview
SchoolConnect is an online platform where high schools can connect with their students online. Teachers and Students will be part of class rooms where they will be able to share class material and chat with eachother. Students also will be able to organize their schedules via a built in calender and view volunteering postions as well as join clubs!

A description of our main features are listed below.

### Account Types
There will be three types of accounts:
    

1.  Student Accounts
    

	-   Can only be created by a school account
    

2.  Teacher Accounts
    

	-   Can only be created by a school account
    
	-   As CRUD abilities for calendar events, classes and clubs
    

3.  School Account
    

	-   Can create new teacher and student accounts
    
	-   Due to security matters the developers must be contacted to receive credentials to create a school account. A code will be sent which will allow the creation of a school account.
    

	-   Teachers can create a class and share an invite code with students to join
    
	-   Every class has a live chat area for students to talk to their classmates and teacher
    
	-   Students can join multiple classes
    
	-   An area where teachers can post volunteer positions available at the school, so students can get hours required for their diploma
    

### Login Page
    
1.  Sign in for students (requires email + password)
    
2.  Sign In for teachers (requires email + password)
    
3.  School account creation (requires email + password + code)
    

### Calendar Feature

-   Teachers and students get a calendar section in which they can place events. Teachers will be allowed to place events that are public for their chosen classes. These public events will appear on the calendar of all students in that class.
    
-   Students will also be allowed to subscribe to club events. If a club owner posts an event on the calendar, then all of their subscribers will also have that even show on their calendar.
    
-   Everyone can add private events that only show up on their own calendar.
    
-   To add events, the user will have to fill out a form with the start time and end time along with a title and description. If they are a teacher and wish to make the post public, then they can select which class and clubs can see it.
    
-   Calendar events can also be deleted.
    

### Clubs

-   Teachers can create clubs and club events. Using a form, the teacher can create a new club with a title and description of the club.
    
-   There will be a separate section that lists all the available clubs students can join where they can read descriptions about the club and see which other students are in that club.
    
-   If a student wishes to join a club, they can click on “Join” and the club's events will be populated on that student's calendar.
    

### Volunteer Board

-   Students in high school need to complete 40 hours of volunteer service to graduate
    
-   Many students have a hard time finding hours to complete
    
-   This area of our application gives teachers the ability to ask students for help with tasks that they might not be able to complete on their own
    
-   A teacher first fills out a form which describes the position, how many students they need and how many hours each student will get
    
-   Then a post is created on the school volunteer board
    
-   A student then can browse the different postings and contact the teacher through email
    

### Classroom

-   A teacher can create a class interact with their students
    
-   The teacher first creates their class using a form
    
-   Once the class is created, a unique code is generated which lets students join the teachers class
    
-   Then teachers can post announcements, create events and share class assignments and files with their students
    

### Chat

-   Each class room has a chat page
    

-   There is only 1 chat for the entire classroom where students can chat with their classmates and teacher in a live chat area
    
-   Solely text based chat
    
## Features Completed in Beta Version
- Login and Account Types
- Classroom
- Calendar Features
## Features Completed in Final Version
- Clubs
- Volunteer Board
- Chat
## Tech Stack

-   React
    
-   MongoDB
    
-   Express
    
-   NodeJS
    
-   Google Cloud for Deployment
    
-   GraphQL
    

  

## Challenges

-   Deployment: none of us have experience deploying a web application on a vm.
    
-   Implementing publisher subscriber system for the calendar events
    
-   Setting up the account system: There are many different types of accounts with this web application. Managing permissions for each type may be difficult.
    
-   Implementing real-time chat: Research is required to find out what libraries are needed to allow this to happen.
    
-   Creating an intuitive and easy to use front-end for all users: this will be a multi page web application with different types of users.
