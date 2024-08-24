# StackMasters-WebApp

Overview
This project consists of making an HMS T&L System that has a web application and mobile application supported by a unified backend with robust backend to supprt secure user management and data storage.

Mobile Application
Platforms
iOS
Android

Features
Browse File-system: Select a video from the user's file system.
Record a Video: Capture a new video using the device’s camera?
Compress Video: Automatically compress videos to optimize upload size?
Upload Video: Upload videos to the system.
Browse Submissions: View previously submitted videos.
View Feedback: Access feedback provided on submitted videos.

Web Application
Features
Create Assignments: Set up new assignments for users.
View Assignments: Access and review existing assignments.
View Submissions: See video submissions related to assignments.
Stream/Download Submission Videos: Watch or download submitted videos.
Provide Feedback: Offer feedback on video submissions.
Download Feedback & Marks: Export feedback and marks in .csv or .xlsx formats.

Backend
Features
Secure Login: Implement secure authentication for user access.
Data Stores: Manage and store data related to users, videos, assignments, and feedback.
User Administration: Handle user roles.

Technologies:

StackMasters Web Application
Not allowed to use firebase/Superbase Backend
LuxFate:
Different Repo for each part ie. one for mobile app, web app, and backend

FOR IF WE CHOOSE HMS
Frontend
React Web based
Component-Based Architecture: React allows developers to build encapsulated components that manage their own state. These components can be composed to create complex UIs.
Virtual DOM: React uses a virtual DOM to improve performance. When the state of an object changes, React updates the virtual DOM first and then efficiently updates the real DOM.
Reusable Components: Components can be reused across different parts of an application, which promotes code reusability and reduces development time.
Strong Community and Ecosystem: React has a large community and a rich ecosystem of libraries and tools, making it easier to find solutions and support.
One-Way Data Binding: React’s one-way data binding ensures that the state flows in a single direction, which makes debugging and understanding the data flow easier.
JSX Syntax: JSX allows developers to write HTML-like code within JavaScript, making the code more readable and easier to write.

React Native Mobile app
Cross-Platform Development: React Native allows developers to use the same codebase for both iOS and Android applications, reducing development time and effort.
Native Performance: React Native components are translated into native UI components, providing a performance that is close to native apps.
Hot Reloading: This feature allows developers to see the changes they make in real-time without recompiling the entire application.
Access to Native Features: React Native provides access to native device features like camera, GPS, and more, through a rich set of APIs.
Reusable Code and Components: Just like React, React Native promotes the use of reusable components, which can be shared between web and mobile applications.
Large Community and Ecosystem: Similar to React, React Native has a large community and a wide array of libraries and tools, making development easier and more efficient.

Backend
Performance: If performance is a key concern, Fastify, Golang Gin, and Golang CHI are excellent choices due to their high throughput and low latency.
Ecosystem and Tooling: For comprehensive ecosystems and robust tooling, Spring Boot and .NET are strong contenders, especially for enterprise-grade applications.
Ease of Use and Learning Curve: For a gentle learning curve and quick development, Express.js and Flask are great options.
Scalability: For highly scalable applications, Spring Boot and .NET provide excellent support for building and managing large applications.
