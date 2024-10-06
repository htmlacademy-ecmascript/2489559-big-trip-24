import EventsListPresenter from './presenter/events-list-presenter.js';
import TripInfoView from './view/trip-info.js';
import PointsModel from './model/response-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButton from './view/new-point-button-element.js';

import { render, RenderPosition } from './framework/render.js';

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsSectionElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const eventsListPresenter = new EventsListPresenter({
  eventsListContainer: tripEventsSectionElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripFiltersElement,
  filterModel,
  pointsModel
});
const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  eventsListPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(newPointButtonComponent, tripMainElement);

filterPresenter.init();
eventsListPresenter.init();
