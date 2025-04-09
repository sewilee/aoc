// https://adventofcode.com/2024/day/2
const fs = require('fs');

const txtFile = 'input';

const input = fs
  .readFileSync(`day2/${txtFile}.txt`, 'utf8')
  .toString()
  .trim()
  .split('\n')
  .map((l) => l.split(' '));

const partOne = (data) => {
  const isReportSafe = (report, min, max) => {
    let tolerlance = 0; // increase 1, decrease -1, 0
    for (let i = 0; i < report.length - 1; i++) {
      const lvlDiff = report[i] - report[i + 1];
      const absDiff = Math.abs(lvlDiff);

      if (absDiff < min || absDiff > max) {
        return false;
      }
      if (i === 0) {
        tolerlance = Math.sign(lvlDiff);
      }
      if (tolerlance !== Math.sign(lvlDiff)) return false;
    }

    return true;
  };

  // 1. go thru each report
  // 2. check if levels are inc/dec thru out and if the difference is 1, 2, or 3

  const safeReports = [];

  data.forEach((report) => {
    if (isReportSafe(report, 1, 3)) {
      safeReports.push(report);
    }
  });

  return safeReports.length;
};

const partTwo = (data) => {
  // const isReportSafeWithDampener = (report, min, max, dampenerCount) => {
  //   let tolerlance = 0; // increase 1, decrease -1, 0
  //   for (let i = 0; i < report.length - 1; i++) {
  //     const lvlDiff = report[i] - report[i + 1];
  //     const absDiff = Math.abs(lvlDiff);

  //     if (i === 0) {
  //       tolerlance = Math.sign(lvlDiff);
  //     }

  //     if (absDiff < min || absDiff > max || tolerlance !== Math.sign(lvlDiff)) {
  //       if (dampenerCount <= 0) return false;
  //       const modReport1 = [...report.slice(0, i), ...report.slice(i + 1)];
  //       const modReport2 = [...report.slice(0, i + 1), ...report.slice(i + 2)];
  //       const modReport3 = [...report.slice(0, i - 1), ...report.slice(i)];

  //       return (
  //         isReportSafeWithDampener(modReport1, min, max, 0) ||
  //         isReportSafeWithDampener(modReport2, min, max, 0) ||
  //         isReportSafeWithDampener(modReport3, min, max, 0)
  //       );
  //     }
  //   }

  //   return true;
  // };

  const isReportSafeWithDampener = (report, min, max) => {
    let tolerlance = 0; // increase 1, decrease -1, 0
    for (let i = 0; i < report.length - 1; i++) {
      const lvlDiff = report[i] - report[i + 1];
      const absDiff = Math.abs(lvlDiff);
      if (absDiff < min || absDiff > max) {
        return false;
      }
      if (i === 0) {
        tolerlance = Math.sign(lvlDiff);
      }
      if (tolerlance !== Math.sign(lvlDiff)) return false;
    }

    return true;
  };

  const safeReports = [];

  data.forEach((report) => {
    if (isReportSafeWithDampener(report, 1, 3)) {
      safeReports.push(report);
    } else {
      for (let i = 0; i < report.length; i++) {
        const modReport = [...report.slice(0, i), ...report.slice(i + 1)];
        if (isReportSafeWithDampener(modReport, 1, 3)) {
          safeReports.push(report);
          break;
        }
      }
    }
  });

  return safeReports.length;
};

console.log('partOne', partOne(input));
console.log('partTwo', partTwo(input));
