export const locationService = {
    getLocations,
    createLocation,
    getLocationById,
    deleteLocation,
    saveEdit
}

const STORAGE_KEY = 'locationsDB'


import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

var gLocations = [];

function getLocations() {
    if (!gLocations.length) loadLocationsFromStorage()
    return Promise.resolve(gLocations)
}

function loadLocationsFromStorage() {
    const loadedLocations = storageService.loadFromStorage(STORAGE_KEY);
    gLocations = (loadedLocations) ? loadedLocations : [];
}

function createLocation(name, lat, lng) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    gLocations.push(location)
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function getLocationById(id) {
    const location = gLocations.find(location => {
        return location.id === id
    })
    return location
}

function getLocationIdxById(id) {
    const location = gLocations.findIndex(location => {
        return location.id === id
    })
    return location
}

function deleteLocation(locId) {
    const locIdx = getLocationIdxById(locId);
    gLocations.splice(locIdx, 1);
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function saveEdit(locId, newName) {
    const locIdx = getLocationIdxById(locId);
    gLocations[locIdx].name = newName;
}