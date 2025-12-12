import { createContext } from "react";

// Default to a safe shape so consumers can destructure without crashing
const UserDetailContext = createContext({
  user: null,
  setUser: () => {}
 
});

export default UserDetailContext;
