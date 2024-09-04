import EditView from '../view/edit-form.js';
import SortView from '../view/sort-view.js';
import RoutePointListView from '../view/route-point-list-view.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/route-edit-form-view.js';

import {render} from '../render.js';

export default class MainPresenter {
  boardComponent = new EditView();
  routePointListComponent = new RoutePointListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.routePointListComponent, this.boardComponent.getElement());
    render(new PointEditFormView(), this.routePointListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.routePointListComponent.getElement());
    }

  }
}
