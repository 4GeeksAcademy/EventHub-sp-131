export const initialStore = () => {
  return {
    tokenPromotor: "",
    promotorAuth: false,
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
    default:
      throw Error("Unknown action.");
  }
}
