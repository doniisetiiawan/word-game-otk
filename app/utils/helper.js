function build400Error(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export default build400Error;
