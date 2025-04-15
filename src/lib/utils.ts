export const storePreviousRoute = (path: string) => {
  if (
    path !== "/auth/login" &&
    path !== "/auth/signup" &&
    path !== "/start-quiz" &&
    path !== "/new-words"
  ) {
    sessionStorage.setItem("previousRoute", path);
  }
};

export const getPreviousRoute = () => {
  const previousRoute = sessionStorage.getItem("previousRoute");
  if (previousRoute) {
    sessionStorage.removeItem("previousRoute");
    return previousRoute;
  }
  return "/";
};

export const clearPreviousRoute = () => {
  sessionStorage.removeItem("previousRoute");
};

