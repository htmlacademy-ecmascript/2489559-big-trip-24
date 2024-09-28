import { getRandomPoints } from '../mocks/points.js';
import { mockDestinations } from '../mocks/destinations.js';
import { mockOffers } from '../mocks/offers.js';

export default class PointsModel {
  #points = getRandomPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationsById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
