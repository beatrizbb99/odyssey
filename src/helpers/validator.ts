interface ValidationResult {
    isValid: boolean;
    errors: { [key: string]: string };
  }
  
  export const validateForm = (data: any): ValidationResult => {
    const errors: { [key: string]: string } = {};
  
    if (!data.email || !isEmail(data.email)) {
      errors.email = 'Invalid email address';
    }
  
    if (!data.password || !isStrongPassword(data.password)) {
      errors.password = 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number';
    }
  
    if (!data.confirmPassword || data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    if (!data.username || data.username.trim().length === 0) {
      errors.username = 'Username is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  const isEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const isStrongPassword = (password: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };
  