export const locationService = {
    getLocations,
    createLocation,
    loadLocationsFromStorage
}

const STORAGE_KEY = 'locationsDB'


import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

var gLocations = [];

function getLocations() {
    return Promise.resolve(gLocations)
}

function loadLocationsFromStorage() {
    const loadedLocations = storageService.loadFromStorage(STORAGE_KEY);
    gLocations = (loadedLocations) ? loadedLocations : [];
}

function createLocation(name, lat, lang) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lang,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    gLocations.push(location)
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}