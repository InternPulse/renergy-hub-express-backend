export const validateAdminDetails = (adminDetails: any) => {
  try {
    const { firstName, lastName, email, password, userType } = adminDetails;

    if (!firstName || !lastName || !email || !password || !userType) {
      return "rejected";
    }
    return "accepted";
  } catch (error: any) {
    console.log("Validate User Details:", error.message);
  }
};
