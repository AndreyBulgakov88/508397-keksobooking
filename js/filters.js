'use strict';

(function () {
  var FILTER_HOUSING_PRICE_DICTIONARY = {
    'low': {minPrice: 0, maxPrice: 10000},
    'middle': {minPrice: 10000, maxPrice: 50000},
    'high': {minPrice: 50000, maxPrice: Infinity}};

  var filteredAdvertisements = [];

  /** @description common function for applying one map filter
    * @param {Node|NodeList} filterFormElement
    * @param {Function} callback
    */
  var applyFilter = function (filterFormElement, callback) {
    if (filterFormElement.value) {
      if (filterFormElement.value === 'any') {
        return;
      }
    }

    filteredAdvertisements = filteredAdvertisements.filter(function (element) {
      return callback(element, filterFormElement);
    });
  };

  /** @description applying advertisement offer type map filter
    * @param {object} advertisement
    * @param {Node} filterFormElement
    * @return {boolean}
    */
  var applyFilterHousingType = function (advertisement, filterFormElement) {
    return advertisement.offer.type === filterFormElement.value;
  };

  /** @description applying advertisement offer price map filter
    * @param {object} advertisement
    * @param {Node} filterFormElement
    * @return {boolean}
    */
  var applyFilterHousingPrice = function (advertisement, filterFormElement) {
    var minPrice = FILTER_HOUSING_PRICE_DICTIONARY[filterFormElement.value].minPrice;
    var maxPrice = FILTER_HOUSING_PRICE_DICTIONARY[filterFormElement.value].maxPrice;
    return advertisement.offer.price >= minPrice && advertisement.offer.price <= maxPrice;
  };

  /** @description applying advertisement offer rooms map filter
    * @param {object} advertisement
    * @param {Node} filterFormElement
    * @return {boolean}
    */
  var applyFilterHousingRooms = function (advertisement, filterFormElement) {
    return advertisement.offer.rooms === Number(filterFormElement.value);
  };

  /** @description applying advertisement offer guests map filter
    * @param {object} advertisement
    * @param {Node} filterFormElement
    * @return {boolean}
    */
  var applyFilterHousingGuests = function (advertisement, filterFormElement) {
    return advertisement.offer.guests === Number(filterFormElement.value);
  };

  /** @description applying advertisement offer features map filter
    * @param {object} advertisement
    * @param {NodeList} filterFormElement
    * @return {boolean}
    */
  var applyFilterFeatures = function (advertisement, filterFormElement) {
    for (var i = 0; i < filterFormElement.length; i++) {
      if (advertisement.offer.features.indexOf(filterFormElement[i].value) === -1) {
        return false;
      }
    }

    return true;
  };

  /** @description common function for filtering advertisements
    */
  var applyFilters = function () {
    var filterHousingTypeElement = document.querySelector('#housing-type');
    var filterHousingPriceElement = document.querySelector('#housing-price');
    var filterHousingRoomsElement = document.querySelector('#housing-rooms');
    var filterHousingGuestsElement = document.querySelector('#housing-guests');
    var filterFeaturesElements = document.querySelectorAll('input[name=features]:checked');

    filteredAdvertisements = window.map.advertisements;

    applyFilter(filterHousingTypeElement, applyFilterHousingType);
    applyFilter(filterHousingPriceElement, applyFilterHousingPrice);
    applyFilter(filterHousingRoomsElement, applyFilterHousingRooms);
    applyFilter(filterHousingGuestsElement, applyFilterHousingGuests);
    applyFilter(filterFeaturesElements, applyFilterFeatures);

    if (filteredAdvertisements.length >= window.map.MAX_RENDERED_ADVERTISEMENTS) {
      filteredAdvertisements = window.util.getRandomValuesFromArray(filteredAdvertisements, window.map.MAX_RENDERED_ADVERTISEMENTS);
    }
  };


  /** @description handler for filter map pins on change map filters
    * @param {event} evt
    */
  var mapFiltersChangeHandler = function () {
    applyFilters();

    window.render.renderMapPins(filteredAdvertisements);
    window.map.advertisementsOnMap = filteredAdvertisements;
  };


  /** @description sets specified accessibility to all filters form fields
    * @param {boolean} accessibility
    */
  var setFiltersAccessibility = function (accessibility) {
    var mapFilters = document.querySelectorAll('.map__filter');
    var mapFeatures = document.querySelector('.map__features');

    mapFilters.forEach(function (element) {
      element.disabled = accessibility;
    });

    mapFeatures.disabled = accessibility;
  };

  window.filters = {
    mapFiltersChangeHandler: mapFiltersChangeHandler,
    setFiltersAccessibility: setFiltersAccessibility
  };
})();