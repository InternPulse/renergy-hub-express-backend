export const checkPasswordMatch = (data: any) => {
  const { password, confirmPassword } = data;

  if (password !== confirmPassword) {
    return false;
  }
  return true;
};
