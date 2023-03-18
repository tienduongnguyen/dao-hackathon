const formatNumber = (num = '', df = '', split = ',') =>
  num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, split) : df;
const formatNumberFloat = (num = '', df = '', split = ',') => {
  try {
    const [inter = 0] = `${num}`.split('.');
    return inter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, split);
  } catch (error) {
    return df;
  }
};
const toDateString = (date: Date | number) => {
  const today = new Date(date);
  const hour = String(today.getHours()).padStart(2, '0');
  const minute = String(today.getMinutes()).padStart(2, '0');
  const second = String(today.getSeconds()).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${hour}:${minute}:${second} - ${dd}/${mm}/${yyyy}`;
};

const numberToTime = (oldDate: any) => {
  const number = new Date().getTime() - new Date(oldDate).getTime();
  let seconds = Math.floor(number / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes - hours * 60;
  let days = Math.floor(hours / 24);
  hours = hours - days * 24;
  const month = Math.floor(days / 30);
  days = days - month * 30;

  if (month) {
    return `${month} tháng`;
  }
  if (days) {
    return `${days} ngày`;
  }
  if (hours) {
    return `${hours} giờ`;
  }
  if (minutes) {
    return `${minutes} phút`;
  }
  return `${seconds} giây`;
};

const createArrayRange = (s: number, e: number, step = 1) => {
  let start = s;
  let end = e;
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from(
    { length: (end - start + step) / step },
    (v, k) => k * step,
  ).map(v => v + start);
};

const checkValidPassword = (password: string) => {
  let isNumber = false;
  let isUpperCase = false;
  let isLowerCase = false;
  password.split('').forEach(char => {
    if (!isNumber && /[0-9]/.test(char)) {
      isNumber = true;
    }
    if (!isUpperCase && /[A-Z]/.test(char)) {
      isUpperCase = true;
    }
    if (!isLowerCase && /[a-z]/.test(char)) {
      isLowerCase = true;
    }
  });

  return (isNumber && isUpperCase && isLowerCase) || password.length === 0;
};
const lengthInUtf8Bytes = (str: string) => {
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
};
const getTypeImage = (image: string) => {
  const imgExt = image.split('.').pop();
  const idxEnd = imgExt?.indexOf('?key=');
  const imageExt = idxEnd === -1 ? imgExt : imgExt?.substring(0, idxEnd);
  return imageExt;
};
export {
  createArrayRange,
  toDateString,
  formatNumber,
  formatNumberFloat,
  numberToTime,
  checkValidPassword,
  lengthInUtf8Bytes,
  getTypeImage,
};
