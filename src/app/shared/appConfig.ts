// export const apiBaseUrl: string = "http://localhost:4000/api";
// export const imageBaseUrl: string = "http://localhost:4000/";
export const apiBaseUrl: string = "https://squadtours-api.herokuapp.com/api";
export const imageBaseUrl: string = "https://squadtours-api.herokuapp.com/";



export const commonRoutes = {
  Login: "login",
  Register: "register",
  ForgotPassword: "forgot-password",
  Home: "Home"
};


export const customerRoutes = {
  Base: "customer",
  List: "list",
  Add: "create",
  Update: "update"
};

export const travelGroupRoutes = {
  Base: "travelGroup",
  List: "list",
  Add: "create",
  Update: "update"
};


export const Gender: any = [
  { id: "Male", text: "Male" },
  { id: "Female", text: "Female" },

];


