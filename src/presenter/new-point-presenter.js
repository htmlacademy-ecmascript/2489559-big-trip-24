import EditorPoint from '../view/editor-point.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import { DEFAULT_POINT, UpdateType, UserAction} from '../utils-constants/constants.js' ;
import { nanoid } from 'nanoid';

export default class NewPointPresenter {
  #eventListContainer = null;
  #pointsModel = null;
  #point = DEFAULT_POINT;
  #handleDataChange = null;
  #handleDestroy = null;
  #editorComponent = null;

  constructor({eventListContainer, pointsModel, onDataChange, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editorComponent !== null) {
      return;
    }
    this.#editorComponent = new EditorPoint({
      point: this.#point,
      typeOffers: this.#pointsModel.getOffersByType('flight'),
      pointDestination: this.#pointsModel.getDestinationsById(this.#point.destination),
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
    });

    render(this.#editorComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editorComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editorComponent);
    this.#editorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      {...point, id: nanoid()},
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}