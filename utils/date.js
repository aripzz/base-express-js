//how to use
// const inputDate = new Date(`${year}-${month}-${day}`);
// const formattedDate = formatDate(inputDate);

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function getMonthName(month) {
  return months[month - 1];
}

function formatDate(date) {
  return `${date.getDate()} ${getMonthName(
    date.getMonth() + 1
  )} ${date.getFullYear()}`;
}
