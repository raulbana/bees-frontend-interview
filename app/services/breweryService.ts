import axios from "axios"
import { Brewery } from "../types";
import { apiRoutes } from "../utils/apiRoutes";

const apiInstance = axios.create({
    baseURL: 'https://api.openbrewerydb.org/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const breweriesService = {
    searchBreweries: async (query: string): Promise<Brewery[]> => {
        try {
            const response = await apiInstance.get(apiRoutes.brewery.search(query));
            return response.data;
        } catch (error) {
            console.error('Error searching breweries:', error);
            throw error;
        }
    }
}