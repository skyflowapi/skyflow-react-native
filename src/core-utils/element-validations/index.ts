export const validatePin = (pinValue: string) => {
  return pinValue.length >= 4 && pinValue.length <= 12;
};
