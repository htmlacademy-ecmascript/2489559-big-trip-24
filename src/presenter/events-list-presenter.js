import EventsList from '../view/events-list.js';
import Plug from '../view/plug.js';
import Sorting from '../view/sorting.js';
import { SortType, PlugText } from '../utils-constants/constants.js';
import PointPresenter from './point-presenter.js';
import { sortBy } from '../utils-constants/sort.js';
import { render } from '../framework/render.js';

export default class PagePresenter {
  #eventsListContainer = null;
  #pointsModel = null;
  #sorting = null;

  #eventsListPoints = [];
  #sourcedPoints = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  #eventsListComponent = new EventsList();
  #listEmpty = new Plug(PlugText.EVERYTHING);

  constructor({eventsListContainer, pointsModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case 'time':
        [...this.#pointsModel.points].sort(sortBy.Time);
        break;
      case 'price':
        [...this.#pointsModel.points].sort(sortBy.Price);
        break;
    }

    return [...this.#pointsModel.points].sort(sortBy.Day);
  }

  init() {
    this.#eventsListPoints = [...this.#pointsModel.points].sort(sortBy.Day);
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#renderPage();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventsListComponent: this.#eventsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderListEmpty() {
    render(this.#listEmpty, this.#eventsListContainer);
  }

  #renderSorting() {
    this.#sorting = new Sorting({
      checkedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sorting, this.#eventsListContainer);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListContainer);
    this.#renderPoints(this.points);
  }

  #renderPage() {

    if (this.points.length === 0) {
      this.#renderListEmpty();
      return;
    }
    this.#renderSorting();
    this.#renderEventsList();
  }


  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderEventsList();
  };
}
