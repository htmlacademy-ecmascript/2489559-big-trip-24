import NewPointPresenter from './new-point-presenter.js';
import EventsList from '../view/events-list.js';
import Plug from '../view/plug.js';
import Sorting from '../view/sorting.js';
import { FilterType, SortType, UpdateType, UserAction, PlugText } from '../utils-constants/constants.js';
import PointPresenter from './point-presenter.js';
import { sortBy } from '../utils-constants/sort.js';
import { render, remove } from '../framework/render.js';
import { filter } from '../utils-constants/filter.js';

export default class PagePresenter {
  #eventsListContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #sorting = null;
  #listEmpty = null;
  #loadingComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #loadingPlug = Object.keys(PlugText).find((item) => item === 'LOADING');
  #isLoading = true;

  #eventsListComponent = new EventsList();

  constructor({eventsListContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      eventListContainer: this.#eventsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoint = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case 'time':
        filteredPoint.sort(sortBy.Time);
        break;
      case 'price':
        filteredPoint.sort(sortBy.Price);
        break;
      case 'day':
        filteredPoint.sort(sortBy.Day);
    }

    return filteredPoint;
  }

  init() {
    this.#renderPage();
  }

  createPoint() {
    if (this.#listEmpty) {
      remove(this.#listEmpty);
    }

    this.#currentSortType = SortType.DAY;
    this.#filterType = FilterType.EVERYTHING;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
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

  #renderListEmpty() {
    this.#listEmpty = new Plug({
      filterType: this.#filterType
    });
    render(this.#listEmpty, this.#eventsListContainer);
  }

  #renderLoading() {
    this.#loadingComponent = new Plug({
      filterType: this.#loadingPlug,
    });
    render(this.#loadingComponent, this.#eventsListContainer);
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderListEmpty();
      return;
    }
    this.#renderSorting();
    this.#renderEventsList();
  }

  #clearPage({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sorting);
    remove(this.#loadingComponent);

    if (this.#listEmpty) {
      remove(this.#listEmpty);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetSortType: true});
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderPage();
  };
}
