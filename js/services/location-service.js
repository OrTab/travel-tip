export const locationService = {
    getLocations,
    createLocation,
    getLocationById
}

const STORAGE_KEY = 'locationsDB'


import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

const gLocations = [];

function getLocations() {
    return Promise.resolve(gLocations)
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
    console.log(gLocations);
}

function getLocationById(id) {
    const location = gLocations.find(location => {
        return location.id === id
    })
    return location
}