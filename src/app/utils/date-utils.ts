export function formatDate(date: Date, format: string) {
  const map: any = {
    mm: ('0' + (date.getMonth() + 1)).slice(-2),
    dd: ('0' + date.getDate()).slice(-2),
    yyyy: date.getFullYear(),
  };
  return format.replace(/mm|dd|yyyy/gi, matched => map[matched]);
}
