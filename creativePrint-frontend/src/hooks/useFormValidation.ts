export const useFormValidation = () => {
    const validateEmail = (email: string): string => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Invalid email format";
      return "";
    };
  
    const validatePassword = (password: string): string => {
      if (password.length < 8) return "Password must be at least 8 characters";
      return "";
    };
  
    return { validateEmail, validatePassword };
  };