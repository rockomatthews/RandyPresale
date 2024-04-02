export const updateTransactionStatus = (paymentId, status) => {
    return {
      type: 'UPDATE_TRANSACTION_STATUS',
      payload: {
        paymentId,
        status,
      },
    };
  };