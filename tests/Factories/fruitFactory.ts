import {faker} from "@faker-js/faker"
import fruits from "data/fruits"
import { FruitInput } from "services/fruits-service"

export function createFruit(name?:String){
    const fruit = {name:name||faker.word.noun(),price:faker.number.float()}
    return fruit
}

export function addFruit(fruit){
    const id = fruits.length+1
    fruits.push({...fruit,id})
}