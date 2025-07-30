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
    getAllBreweries: async (): Promise<Brewery[]> => {
        try {
            const response = await apiInstance.get(apiRoutes.brewery.getAll);
            return response.data;
        } catch (error) {
            console.error('Error fetching breweries:', error);
            throw error;
        }
    },
    getBreweryById: async (id: string): Promise<Brewery | null> => {
        try {
            const response = await apiInstance.get(apiRoutes.brewery.getById(id));
            return response.data;
        } catch (error) {
            console.error(`Error fetching brewery with ID ${id}:`, error);
            throw error;
        }
    },
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