'use strict'

export const locationService = {
    getLocations,
    createLocation,
    getLocationById,
    getSearchCords
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

function getLocationById(id) {
    const location = gLocations.find(location => {
        return location.id === id
    })
    return location
}


function getSearchCords(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCEJl0w5I2nD7X9lQvtBWN5f02Xp1skT1A`)
        .then(res => {
            // console.log('Axios res:', res);
            return res.data
        })
        .catch(err => err)
}
// AIzaSyCEJl0w5I2nD7X9lQvtBWN5f02Xp1skT1A