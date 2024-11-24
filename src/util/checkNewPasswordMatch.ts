export const checkNewPasswordMatch = (data: any) => {
  const { newPassword, confirmNewPassword } = data;

  if (newPassword !== confirmNewPassword) {
    return false;
  }
  return true;
};
