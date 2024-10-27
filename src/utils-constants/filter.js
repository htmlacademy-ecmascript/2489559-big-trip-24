import { FilterType } from './constants.js';
import { isEventOver, isFutureEvent, isPresentEvent } from './date-time.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventOver(point.dateTo)),
};

export { filter };
