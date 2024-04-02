const initialState = {};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TRANSACTION_STATUS':
      return {
        ...state,
        [action.payload.paymentId]: action.payload.status,
      };
    default:
      return state;
  }
};

export default transactionReducer;