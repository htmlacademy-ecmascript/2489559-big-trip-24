import dayjs from 'dayjs';

const getTimeDifference = ({dateFrom, dateTo}) => dayjs(dateTo).diff(dayjs(dateFrom));
const sortBy = {
  Price: (pointA, pointB) => pointB.basePrice - pointA.basePrice,
  Time: (pointA, pointB) => getTimeDifference(pointB) - getTimeDifference(pointA),
  Day: (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom),
};


export { sortBy };
