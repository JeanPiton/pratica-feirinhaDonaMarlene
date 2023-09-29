import supertest from "supertest"

import app from "index"
import fruits from "data/fruits"
import { addFruit, createFruit } from "./Factories/fruitFactory"

const api = supertest(app)

beforeEach(()=>{
    fruits.splice(0,fruits.length)
})

describe("post /fruits",()=>{
    it("should return 201 when inserting a fruit",async ()=>{
        const fruit = createFruit()
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(201)
    })
    it("should return 409 when inserting a fruit that is already registered",async ()=>{
        const fruit = createFruit()
        addFruit(fruit)
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(409)
    })
    it("should return 422 when inserting a fruit with name missing",async ()=>{
        const fruit = createFruit()
        delete fruit.name
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(422)
    })
    it("should return 422 when inserting a fruit with price missing",async ()=>{
        const fruit = createFruit()
        delete fruit.price
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(422)
    })
})
describe("get /fruits",()=>{
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist",async ()=>{
        const id = fruits.length + 1
        const {status} = await api.get(`/fruits/${id}`)
        expect(status).toBe(404)
    })
    it("should return 400 when id param is present but not valid",async ()=>{
        const {status} = await api.get(`/fruits/apple`)
        expect(status).toBe(400)
    })
    it("should return one fruit when given a valid and existing id",async ()=>{
        const fruit = createFruit()
        addFruit(fruit)
        addFruit(createFruit())
        const {body} = await api.get("/fruits/1")
        expect(body).toEqual({
            ...fruit,
            id:1
        })
    })
    it("should return all fruits if no id is present",async ()=>{
        addFruit(createFruit())
        addFruit(createFruit())
        const {body} = await api.get("/fruits")
        expect(body).toHaveLength(2)
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id:expect.any(Number),
                name:expect.any(String),
                price:expect.any(Number)
            })
        ]))
    })
})