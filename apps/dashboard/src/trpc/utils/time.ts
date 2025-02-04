/// This functions are used to generate the metrics for the endpoints ///

export const generateLast30DaysData = (
  rows: {submissions: number; dateTime: number}[]
) => {
  // Step 1: Create a map from the input rows, normalizing the keys to date-only
  const dataMap = new Map(
    rows.map(row => {
      const date = new Date(row.dateTime * 1000).toISOString();
      const dateOnly = date.split('T')[0]; // Extract the date part (YYYY-MM-DD)
      return [dateOnly, row.submissions];
    })
  );

  // Step 2: Generate the last 30 days as ISO date strings
  const now = new Date();
  const chartData = [];

  for (let i = 29; i >= 0; i--) {
    const pastDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const isoDate = pastDate.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)

    chartData.push({
      dateTime: `${isoDate}T00:00:00.000Z`,
      submissions: dataMap.get(isoDate) || 0
    });
  }

  return chartData;
};

export const generateLast24HoursData = (
  rows: {submissions: number; dateTime: number}[]
) => {
  // Step 1: Create a map from the query result for quick lookup
  const dataMap = new Map(
    rows.map(row => [
      new Date(row.dateTime * 1000).toISOString(),
      row.submissions
    ])
  );

  // Step 2: Generate the last 24 hours as ISO strings in UTC
  const now = new Date();
  const chartData = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours() - i
      )
    ); // Set to the start of each hour in UTC
    const isoDateTime = hour.toISOString();

    // Step 3: Fill in the data or default to 0 if no submissions
    chartData.push({
      dateTime: isoDateTime,
      submissions: dataMap.get(isoDateTime) || 0
    });
  }

  return chartData;
};
