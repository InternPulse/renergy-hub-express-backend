export const checkNewPasswordMatch = (data: any) => {
  const { newPassword, confirmNewPassword } = data;
  console.log(data);

  if (newPassword !== confirmNewPassword) {
    return false;
  }
  return true;
};
