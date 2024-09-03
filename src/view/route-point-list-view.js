import {createElement} from '../render.js';

function createRoutePointListTemplate() {
  return '<div class="trip-events__list"></div>';
}

export default class RoutePointListView {
  getTemplate() {
    return createRoutePointListTemplate();
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
