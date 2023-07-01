const successResponse = ({ data, message, code = 200 }, h) => {
  const response = {
    status: 'success',
  };
  if (message) {
    response.message = message;
  } if (data) {
    response.data = data;
  }
  return h.response(response).code(code);
};

module.exports = { successResponse };
