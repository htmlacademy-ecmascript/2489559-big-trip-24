import FilterView from './view/filter-view.js';
import PriceView from './view/route-price-view.js';
import {render, RenderPosition} from './render.js';
import MainPresenter from './presenter/main-presenter.js';

const siteMainElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteHeaderPriceElement = document.querySelector('.trip-main');
const boardPresenter = new MainPresenter({boardContainer: siteMainElement});

render(new PriceView(), siteHeaderPriceElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), siteHeaderElement);

boardPresenter.init();
