
import { Request, Response } from 'express';
import db from "../models";
import { w3_create_collection } from "../web3";

export class UserController {
  public static async create(req: Request, res: Response) {
    // Validate request
    console.log("body =", req.params);
    if (!req.body
      || !req.body.name
      || (!req.body.email && !req.body.wallet)
      || !req.body.role) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    // Create a User
    const user = {
      name: req.body.name,
      email: req.body.email,
      wallet: req.body.wallet,
      role: req.body.role,
    };

    // Save User in the database
    db.User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while adding a User."
        });
      });
  }

  public static async remove(req: Request, res: Response) {
    // Validate request
    if (!req.body || !req.body.id) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    
    db.User.destroy({
      where: {
        id: req.body.id
      }
    })
    .then(data => {

      console.log("data", data);
      res.status(200).send();
      //res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing a User."
      });
    });
  }

  public static async update(req: Request, res: Response) {
    // Validate request
    console.log("body =", req.params);
    if (!req.body
      || !req.body.id
      || !req.body.name
      || (!req.body.email && !req.body.wallet)
      || !req.body.role) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    // Create a User
    const user = {
      name: req.body.name,
      email: req.body.email,
      wallet: req.body.wallet,
      role: req.body.role,
    };

    // Save User in the database
    db.User.update(user, {
      where: {
        id: req.body.id
      }
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Updating a User."
        });
      });
  }

  public static async all(req: Request, res: Response) {
    let email = req.params.email;
    let _promise = db.User.findAll();
    if (email) {  
      _promise = db.User.findAll({
        where: {
          email
        }
      });
    }
    _promise
      .then(data => {
        console.log("all data =", data);
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while listing Users."
        });
      });
  }

  public static async getDetails(req: Request, res: Response) {
    res.status(200).send({})
  }
}