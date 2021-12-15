# FI-MA1 Website

This is a productivity website with features designed for students to manage their tasks and notes, and for teachers to pass on announcements with minimum hassle.

[Currently deployed](https://fima1.vercel.app/) with Vercel.

## "Inspired by Firefly"

I cannot deny that some of the website's features have been "inspired" by Firefly... but they probably weren't the first to do it anyway!

Current features:

- The **Gallery**, each account can upload images, which are shared globally;
- The **Announcements** and **Reads** sections, managed by teachers, shared globally;
- **Tasks** and **Notes**, specific to each account, managed by the respective user.

## To Run the Project

1.  Install [Node.js](https://nodejs.org/en/download/)
2.  Clone this repository
3.  Create a `.env.local` file and paste in the API keys you stole from me
4.  In the root of the project directory, run `npm install` then `npm run dev`.

## Stack

This project uses the following technologies:

- Frontend
  - Next.js
  - MUI
- Backend
  - MongoDB + Mongoose (auth, etc.)
  - Firebase (for storage)

## Roadmap

Here are some features that are currently being implemented or which I plan to implement in the future:

- [ ] Dashboard for the teacher to set tasks for all or some students
- [ ] HTML markup for tasks
- [x] ~~Typescript...? Nahhh.~~

Please feel free to open an issue for requested features or suggestions.
