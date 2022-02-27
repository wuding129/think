export const safeJSONParse = (str, defaultValue = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
};

export const safeJSONStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return "";
  }
};
