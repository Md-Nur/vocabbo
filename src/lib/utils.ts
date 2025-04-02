export const storePreviousRoute = (path: string) => {
  if (path !== "/auth/login" && path !== "/auth/signup") {
    sessionStorage.setItem("previousRoute", path);
  }
};

export const getPreviousRoute = () => {
  return sessionStorage.getItem("previousRoute") || "/";
};

export const clearPreviousRoute = () => {
  sessionStorage.removeItem("previousRoute");
};
