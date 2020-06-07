import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        image: `http://192.168.1.104:3333/uploads/${item.image}`,
        title: item.title,
      };
    });

    return response.json(serializedItems);
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;
    const item = await knex("items").select("*").where("id", id).first();

    if (!item) return response.status(404).json({ message: "Item not found!" });

    const serializedItem = {
      id: item.id,
      image: `http://192.168.1.104:3333/uploads/${item.image}`,
      title: item.title,
    };

    return response.json(serializedItem);
  }
}

export default ItemsController;
