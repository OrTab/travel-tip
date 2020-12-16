export const locationService = {
    getLocations,
    createLocation
}

const STORAGE_KEY = 'locationsDB'


import { utilService } from '../../util/travel-tip-util.js'
import { storageService } from '../../util/travel-tip-storage.js'

const gLocations = [{ id: 212, name: 'hi', lat: 17, lang: 122, createdAt: Date.now() }, { id: 2132, name: 'hhhhi', lat: 117, lang: 922, createdAt: Date.now() }];

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
        updatedAt,
    }
    gLocations.push(location)
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}