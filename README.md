# 🔐 Auth101: React Router Authentication with remix-auth

![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Remix Auth](https://img.shields.io/badge/Remix_Auth-v4-8A2BE2?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

A sample repository demonstrating how to implement authentication in React Router applications using remix-auth. This project showcases multiple authentication strategies including GitHub OAuth and Trinsic authentication.

## ✨ Features

- 🔒 Multiple authentication strategies (GitHub, Trinsic)
- 🛡️ Protected routes with authentication guards
- 🔄 Session management with cookies
- 🧩 TypeScript for type safety
- 🎨 Clean UI with Tailwind CSS
- 📱 Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lucasamonrc/auth101.git
   cd auth101
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   TRINSIC_ACCESS_TOKEN=your_trinsic_access_token
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🔍 How It Works

### Authentication Flow

1. User navigates to the login page
2. User selects an authentication provider (GitHub or Trinsic)
3. User is redirected to the provider's authentication page
4. After successful authentication, the provider redirects back to our callback URL
5. The application creates a session for the authenticated user
6. User is redirected to the protected home page

### Project Structure

```
app/
├── models/          # Data models
├── routes/          # Application routes
│   ├── auth/        # Authentication routes
│   │   ├── github/  # GitHub authentication
│   │   └── trinsic/ # Trinsic authentication
│   ├── home.tsx     # Protected home page
│   └── login.tsx    # Login page
├── services/        # Services
│   └── authenticator.ts  # Authentication service
└── sessions.server.ts    # Session management
```

## 🛠️ Technologies Used

- **React Router v7**: For routing and navigation
- **remix-auth**: Authentication library for React applications
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Vite**: For fast development and building

## 📚 Learn More

- [React Router Documentation](https://reactrouter.com/en/main)
- [remix-auth Documentation](https://github.com/sergiodxa/remix-auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Trinsic Documentation](https://docs.trinsic.id)

## 🙏 Acknowledgements

- [React Router team](https://reactrouter.com/) for the amazing routing library
- [Sergio Xalambrí](https://github.com/sergiodxa) for creating remix-auth
