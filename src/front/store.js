export const initialStore = () => {
  return {
    tokenPromotor: "",
    promotorAuth: false,
    tokenUser: localStorage.getItem("tokenUser") || "",
    userAuth: localStorage.getItem("userAuth") === "true",
    privateUser: null
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "ADD_TOKEN_PROMOTOR":
      return {
        ...store,
        tokenPromotor: action.payload,
      };
    case "ADD_LOGIN_STATUS_PROMOTOR":
      return {
        ...store,
        promotorAuth: action.payload,
      };
    case "PROMOTOR_LOGOUT":
      return {
        ...store,
        tokenPromotor: "",
        promotorAuth: false,
      };
      
     case "ADD_TOKEN_USER":
      return {
        ...store,
        tokenUser: action.payload,
      };

    case "ADD_LOGIN_STATUS_USER":
      return {
        ...store,
        userAuth: action.payload,
      };

    case "GET_PRIVATE_USER":
      return {
        ...store,
        privateUser: action.payload,
      };

    case "USER_LOGOUT":
      return {
        ...store,
        tokenUser: "",
        userAuth: false,
        privateUser: null,
      };

    default:
      throw Error("Unknown action.");
  }
}
   
