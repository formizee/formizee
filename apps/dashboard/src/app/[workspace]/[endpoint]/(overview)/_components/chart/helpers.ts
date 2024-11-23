type ChartDataEntry = {
  dateTime: string;
  submissions: number;
};

interface Data {
  totalSubmissions: number;
  '24h': ChartDataEntry[];
  '30d': ChartDataEntry[];
}

const calculateTimeRangeSubmissions = (
  data: ChartDataEntry[],
  range: string
): number => {
  const now = new Date(); // Current date and time
  let startDate: Date;

  // Determine the start date based on the range
  if (range === '30d') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 30); // Go back 30 days
  } else if (range === '7d') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7); // Go back 7 days
  } else {
    throw new Error("Invalid range. Use '30d' or '7d'.");
  }

  // Filter the data to include only entries within the range
  const filteredData = data.filter(entry => {
    const entryDate = new Date(entry.dateTime);
    return entryDate >= startDate && entryDate <= now;
  });

  // Calculate the total submissions for the filtered data
  const totalSubmissions = filteredData.reduce(
    (total, entry) => total + entry.submissions,
    0
  );

  return totalSubmissions;
};

const calculateTotalSubmissions = (data: ChartDataEntry[]) => {
  return data.reduce((total, entry) => total + entry.submissions, 0);
};

export const countTimeRangeSubmissions = (data: Data, timeRange: string) => {
  return timeRange === '1d'
    ? calculateTotalSubmissions(data['24h'])
    : calculateTimeRangeSubmissions(data['30d'], timeRange);
};

export const filterDataByTimeRange = (data: Data, timeRange: string) => {
  const referenceDate = new Date();
  let daysToSubtract = 1;

  if (timeRange === '1d') {
    return data['24h'].filter(item => {
      const date = new Date(item.dateTime);
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }

  return data['30d'].filter(item => {
    const date = new Date(item.dateTime);
    daysToSubtract = 30;

    if (timeRange === '7d') {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
};
