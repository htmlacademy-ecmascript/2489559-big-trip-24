import AbstractView from '../framework/view/abstract-view';
import { PlugText } from '../utils-constants/constants';

const createPlugTemplate = (filterType) => {
  const listEmptyValue = PlugText[filterType];
  return (`
  <p class="trip-events__msg">${listEmptyValue}</p>
`);
};

export default class Plug extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createPlugTemplate(this.#filterType);
  }
}
