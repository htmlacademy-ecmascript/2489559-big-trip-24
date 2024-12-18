import { createImageSection, createOfferItemTemplate, createTypeGroupTemplate, setDeleteButtonName } from './editor-form-elements.js';
import { GROUP_TYPES } from '../utils-constants/constants.js';
import { makeCapitalized } from '../utils-constants/utils.js';
import { DateFormat, humanizePointDueDate } from '../utils-constants/date-time.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

import 'flatpickr/dist/flatpickr.min.css';

const createEditorPointTemplate = (state, allDestinations) => {
  const { id, basePrice, type, dateFrom, dateTo, offers, typeOffers, destination, isDeleting, isDisabled, isSaving } = state;

  const startTime = humanizePointDueDate(dateFrom, DateFormat.FULL_DATE_FORMAT);
  const endTime = humanizePointDueDate(dateTo, DateFormat.FULL_DATE_FORMAT);

  const typeName = makeCapitalized(type);

  const pointDestination = allDestinations.find((item) => item.id === destination);

  const createAllOffers = typeOffers.offers
    .map((offer) => {
      const checkedClassName = offers.includes(offer.id) ? 'checked' : '';
      return createOfferItemTemplate(type, offer.title, offer.price, offer.id, checkedClassName);
    }).join('');

  const createTypeList = GROUP_TYPES
    .map((group) => {
      const checkedClassName = group === typeName ? 'checked' : '';
      const groupName = makeCapitalized(group);
      return createTypeGroupTemplate(groupName, checkedClassName);
    }).join('');


  const createButtonRollUp = id
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>` : '';

  const createSectionOffers = typeOffers !== undefined && typeOffers.offers.length > 0
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createAllOffers}
        </div>
      </section>
    `
    : '';

  const createSecionDestination = pointDestination !== undefined ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      ${createImageSection(pointDestination.pictures)}
    </section>` : '';

  const createDesinationTemplate = allDestinations
    .map((item) => `<option value="${item.name}"></option>`).join('');

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeList}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeName}
          </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination !== undefined ? he.encode(pointDestination.name) : ''}" list="destination-list-1" required  ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${createDesinationTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" max="10000" step="1" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>${setDeleteButtonName(id, isDeleting)}</button>
        ${createButtonRollUp}
      </header>
      <section class="event__details">
        ${createSectionOffers}
        ${createSecionDestination}
      </section>
    </form>
  </li>`
  );
};

export default class EditorPoint extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = [];
  #handleFormSubmit = null;
  #handleEditRollUp = null;
  #initialPoint = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleDeleteClick = null;

  constructor({point, typeOffers, pointDestination = false, allOffers, allDestinations, onFormSubmit, onEditRollUp, onDeleteClick}) {
    super();
    this.#initialPoint = point;
    this._setState(EditorPoint.parsePointToState(point, pointDestination.id, typeOffers));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditRollUp = onEditRollUp;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createEditorPointTemplate(this._state, this.#allDestinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  reset() {
    this.updateElement({
      ...this.#initialPoint,
      typeOffers: this.#allOffers.find((offer) => offer.type === this.#initialPoint.type),
    });
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#editRollUpHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeListChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerSelectHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this._state.dateFrom === null) {
      this.element.querySelector('#event-start-time-1').setAttribute('style', 'border: 1px solid red; border-radius: 3px');
      return;
    }
    if (this._state.dateTo === null) {
      this.element.querySelector('#event-end-time-1').setAttribute('style', 'border: 1px solid red; border-radius: 3px');
      return;
    }
    if (this._state.dateTo < this._state.dateFrom) {
      this.element.querySelector('#event-end-time-1').setAttribute('style', 'color: red');
      return;
    }
    this.#handleFormSubmit(EditorPoint.parseStateToPoint(this._state));
  };

  #editRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditRollUp(EditorPoint.parseStateToPoint(this.#initialPoint));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#setDatepickerEnd();
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #typeListChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.find((item) => item.type === targetType);
    this.updateElement({
      type: targetType,
      typeOffers: typeOffers,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.name === targetDestination);
    this.updateElement({
      destination: newDestination.id,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this._setState({
      basePrice: parseInt(newPrice, 10)
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditorPoint.parseStateToPoint(this.#initialPoint));
  };

  #offerSelectHandler = () => {
    const checkedOffersElement = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const checkedOffersById = Array.from(checkedOffersElement).map((item) => item.dataset.offerId);
    this._setState({
      offers: checkedOffersById
    });
  };


  static parsePointToState(point, pointDestination, typeOffers) {
    return {
      ...point,
      destination: pointDestination,
      typeOffers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    if (point.typeOffers) {
      delete point.typeOffers;
    }

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
