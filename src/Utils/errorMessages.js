export default function handleErrorMessages(errorMessage) {
  if (errorMessage === "Invalid login credentials") {
    return "Wrong email or password.";
  } else if (errorMessage === "User already registered") {
    return "Email is already registered.";
  } else if (errorMessage === "Failed to fetch") {
    return "Something went wrong. Check your internet connection and try again.";
  } else {
    return "Something went wrong! Try again.";
  }
}
