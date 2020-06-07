import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    const points = knex("points").select("*");

    if (city) points.where("city", "LIKE", "%" + city + "%");

    if (uf) points.where("uf", "LIKE", "%" + uf + "%");

    if (items) {
      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      points
        .join("point_items", "points.id", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems);
    }

    return response.json(await points);
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;
    const point = await knex("points").select("*").where("id", id).first();

    if (!point)
      return response.status(404).json({ message: "Point not found!" });

    const items = await knex("items")
      .join("point_items", "items.id", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  async store(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    } = request.body;

    const items = request.body.items || [];
    
    // const trx = await knex.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=250&q=30",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await knex("points").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        point_id,
        item_id,
      };
    });

    await knex("point_items").insert(pointItems);

    return response.json({ point, items });
  }
}

export default PointsController;
