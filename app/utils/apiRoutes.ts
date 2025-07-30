export const apiRoutes = {
    brewery: {
        getAll: '/breweries',
        getById: (id: string) => `/breweries/${id}`,
        search: (query: string) => `/breweries/search?query=${encodeURIComponent(query)}`,
    }
}