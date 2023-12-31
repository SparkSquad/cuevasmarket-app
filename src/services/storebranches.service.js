import { API_URL } from "../config";
import RequestsHelper from "../helpers/RequestsHelper";
import { getLoggedUserToken } from "../helpers/loggedUser";

export const StoreBranchesSearchResult = {
    Success: 0,
    ServerError: 1,
    RequestError: 2,
    UnknownError: 3
}

export async function searchStoreBranches(keyword, maxResults, page) {
    const req = new RequestsHelper(API_URL);
    const response = await req.get(`storebranches/search/${keyword}?maxResults=${maxResults}&page=${page}`);
    let status = response.statusCode;
    switch(status) {
        case 200:
            return { result: StoreBranchesSearchResult.Success, data: response.data };

        case 500:
            return { result: StoreBranchesSearchResult.ServerError };
        
        default:
            return { result: StoreBranchesSearchResult.UnknownError };
    }
}

export async function registerStoreBranch(name, address, latitude, longitude, openingHours, closingHours) {
    const req = new RequestsHelper(API_URL);
    const response = await req.post("storebranches", {
        name,
        address,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        openingHours,
        closingHours
    }, getLoggedUserToken());
    let status = response.statusCode;
    switch(status) {
        case 201:
            return { result: StoreBranchesSearchResult.Success, data: response.data };

        case 400:
            return { result: StoreBranchesSearchResult.RequestError, data: response.data };

        case 500:
            return { result: StoreBranchesSearchResult.ServerError };
        
        default:
            return { result: StoreBranchesSearchResult.UnknownError };
    }
}
