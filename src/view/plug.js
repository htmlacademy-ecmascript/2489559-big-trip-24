import AbstractView from '../framework/view/abstract-view';

const createPlugTemplate = (text) => `
    <p class="trip-events__msg">${text}</p>
`;

export default class Plug extends AbstractView {
  #text = null;
  constructor(text) {
    super();
    this.#text = text;
  }

  get template() {
    return createPlugTemplate(this.#text);
  }
}
