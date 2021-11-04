import Router from 'koa-router';
import coffeeStore from './store';
import { broadcast } from "../utils";

export const router = new Router();
let getStartIndex = 0
let getStopIndex = 12

router.get('/', async (ctx) => {
    const response = ctx.response;
    const userId = ctx.state.user._id;
    response.body = (await coffeeStore.find({ userId }));
    response.status = 200; // ok
});

router.get('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const coffee = await coffeeStore.findOne({ _id: ctx.params.id });
    const response = ctx.response;
    if (coffee) {
        if (coffee.userId === userId) {
            response.body = coffee;
            response.status = 200; // ok
        } else {
            response.status = 403; // forbidden
        }
    } else {
        response.status = 404; // not found
    }
});

const createCoffee = async (ctx, note, response) => {
    try {
        const userId = ctx.state.user._id;
        note.userId = userId;
        response.body = await coffeeStore.insert(note);
        response.status = 201; // created
        broadcast(userId, { type: 'created', payload: note });
    } catch (err) {
        response.body = { message: err.message };
        response.status = 400; // bad request
    }
};

router.post('/', async ctx => await createCoffee(ctx, ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
    const coffee = ctx.request.body;
    const id = ctx.params.id;
    const coffeeId = coffee._id;
    const response = ctx.response;
    if (coffeeId !== id) {
        response.body = { message: 'Param id and body _id should be the same' };
        response.status = 400; // bad request
        return;
    }
    if (coffeeId === undefined) {
        await createCoffee(ctx, coffee, response);
    } else {
        const userId = ctx.state.user._id;
        coffee.userId = userId;
        const updatedCount = await coffeeStore.update({ _id: id }, coffee);
        if (updatedCount === 1) {
            response.body = coffee;
            response.status = 200; // ok
            broadcast(userId, { type: 'updated', payload: coffee });
        } else {
            response.body = { message: 'Resource no longer exists' };
            response.status = 405; // method not allowed
        }
    }
});

router.del('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const coffee = await coffeeStore.findOne({ _id: ctx.params.id });
    if (coffee && userId !== coffee.userId) {
        ctx.response.status = 403; // forbidden
    } else {
        await coffeeStore.remove({ _id: ctx.params.id });
        ctx.response.status = 204; // no content
    }
});
