export const validateUserDetails = (userDetails: any) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = userDetails;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return "rejected";
    }
    return "accepted";
  } catch (error: any) {
    console.log("Validate User Details:", error.message);
  }
};
