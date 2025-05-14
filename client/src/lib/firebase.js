// Mock Firebase auth for demo purposes
export const mockAuth = {
  // Mock sign in function
  signInWithGoogle: () => {
    return new Promise((resolve) => {
      console.log("Mock: Sign in with Google");
      setTimeout(() => {
        resolve({
          user: {
            uid: "mock-uid-123",
            email: "trinh@gmail.com",
            displayName: "Trinh",
            photoURL: "https://via.placeholder.com/150",
          },
        });
      }, 1000);
    });
  },

  // Mock sign out function
  signOut: () => {
    return new Promise((resolve) => {
      console.log("Mock: Sign out");
      setTimeout(resolve, 500);
    });
  },

  // Mock current user
  currentUser: null,
};

export default mockAuth;
