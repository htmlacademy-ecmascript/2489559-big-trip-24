import { createElement } from '../render';

function createEditFormTemplate() {
  return '<section class="trip-events"></section>';
}

export default class EditView {
  getTemplate() {
    return createEditFormTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
