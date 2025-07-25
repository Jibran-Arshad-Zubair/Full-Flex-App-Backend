const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default isValidId;
