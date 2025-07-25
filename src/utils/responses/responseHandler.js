export const successfulResponse = (message, data = null) => ({
  success: true,
  message,
  data,
});

export const invalidResponse = (message, errors = null) => ({
  success: false,
  message,
  errors,
});
