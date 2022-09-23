export const appendZeroToOne = (value) => {
  if (value.length === 1 && Number(value) === 1) {
    return `0${value}`;
  }
  return value;
};

export const formatExpirationMonthValue = (value: string) => {
  if (value.length === 1 && Number(value) >= 2) {
    return `0${value}`;
  }
  return value;
};

export const getYearAndMonthBasedOnFormat = (cardDate, format: string) => {
  const [part1, part2] = cardDate.split('/');
  switch (format) {
    case 'MM/YY':
      return { month: part1, year: 2000 + Number(part2) };
    case 'YY/MM':
      return { month: part2, year: 2000 + Number(part1) };
    case 'YYYY/MM':
      return { month: part2, year: part1 };
    // MM/YYYY
    default:
      return { month: part1, year: part2 };
  }
};
