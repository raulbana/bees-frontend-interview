import { Brewery } from "./brewery";

export interface User{
    name: string;
    surname: string;
    fullName: string;
    favoriteBreweries: Brewery[];
}