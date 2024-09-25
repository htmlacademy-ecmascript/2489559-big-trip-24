import EventsListPresenter from './presenter/events-list-presenter.js';
import TripInfoView from './view/trip-info.js';
import Filters from './view/filters.js';
import PointsModel from './model/response-model.js';
import { generateFilter } from './mocks/filters.js';

import { render, RenderPosition } from './framework/render.js';

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsSectionElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const eventsListPresenter = new EventsListPresenter({
  eventsListContainer: tripEventsSectionElement,
  pointsModel,
});
const filters = generateFilter(pointsModel.points);
render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new Filters({filters}), tripFiltersElement);

eventsListPresenter.init();
