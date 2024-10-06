import dayjs from 'dayjs';

const GROUP_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const ID_IMAGES = [1, 2, 3, 4, 5];

const SortType = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
};

const PlugText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.LOADING]: 'Loading...',
  [FilterType.LOADING_ERROR]: 'Failed to load latest route information'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const DEFAULT_POINT = {
  id: 0,
  basePrice: '0',
  dateFrom: dayjs(new Date()).toISOString(),
  dateTo: dayjs(new Date()).toISOString(),
  destination: '0',
  isFavorite: false,
  offers: [],
  type: GROUP_TYPES[5]
};

export { GROUP_TYPES, SortType, ID_IMAGES, PlugText, FilterType, Mode, UserAction, UpdateType, DEFAULT_POINT};
