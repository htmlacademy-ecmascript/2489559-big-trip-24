import { getRandomPoint } from '../mocks/points.js';
import { mockDestinations } from '../mocks/destinations.js';
import { mockOffers } from '../mocks/offers.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  destinations = mockDestinations;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getDestinationsById(id) {
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((item) => item.type === type);
  }

  getOffersById(type, itemsId) {
    const OffersType = this.getOffersByType(type);
    return OffersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
