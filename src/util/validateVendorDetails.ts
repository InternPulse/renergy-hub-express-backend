export const validateVendorDetails = (vendorDetails: any) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      brandName,
      brandType,
      streetAddress,
      city,
      zipCode,
      taxID,
      userType,
    } = vendorDetails;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !brandName ||
      !brandType ||
      !streetAddress ||
      !city ||
      !zipCode ||
      !taxID ||
      !userType
    ) {
      return "rejected";
    }
    return "accepted";
  } catch (error: any) {
    console.log("Validate User Details:", error.message);
  }
};
