class HelperFunctionService {
  async slugIt(str) {
    return str
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  async slugItRandom(str) {
    const randomPrefix = Math.random().toString(36).substring(2, 4);
    return `${randomPrefix}-${str
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`;
  }
  async isArrayOfStrings(arr) {
    return Array.isArray(arr) && arr.every((item) => typeof item === "string");
  }
  async generateReadablePassword(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  async validateRequiredFields(data, requiredFields) {
    const isEmptyString = (str) => {
      if (typeof str !== "string") return false;
      const textOnly = str.replace(/<[^>]*>/g, "").trim();
      return textOnly.length === 0;
    };
    const tryParseJSON = (str) => {
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    };
    const missingFields = requiredFields.filter((field) => {
      const fieldKey = Object.keys(data).find(
        (k) => k.toLowerCase() === field.toLowerCase()
      );
      if (!fieldKey) {
        return true;
      }
      let value = data[fieldKey];
      if (typeof value === "string") {
        const parsed = tryParseJSON(value);
        if (Array.isArray(parsed)) {
          value = parsed;
        } else if (isEmptyString(value)) {
          return true;
        }
      }

      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        const allEmpty = value.every(
          (item) =>
            item === null ||
            item === undefined ||
            (typeof item === "string" && item.trim() === "")
        );
        if (allEmpty) return true;
        return false;
      }
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    });
    if (missingFields.length > 0) {
      return {
        isValid: false,
        missingFields,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  async parseArrayIfNeeded(value) {
    if (!value) return null;
    try {
      // If value is already an array
      if (Array.isArray(value)) return value;

      // If it's a string that looks like an array, parse it
      if (typeof value === "string" && value.startsWith("[")) {
        return JSON.parse(value);
      }

      // If it's a comma-separated string (e.g., "a,b,c")
      if (typeof value === "string" && value.includes(",")) {
        return value.split(",").map((v) => v.trim());
      }

      // Else return it wrapped in an array
      return [value];
    } catch (e) {
      return [value];
    }
  }

  async generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
export const {
  slugIt,
  slugItRandom,
  isArrayOfStrings,
  generateReadablePassword,
  validateRequiredFields,
  parseArrayIfNeeded,
  generateOTP,
} = new HelperFunctionService();
