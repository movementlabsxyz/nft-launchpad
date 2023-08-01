
import { Request, Response } from 'express';
import db from "../models";
import { getCurrentSupply, w3_create_collection } from "../web3";

export class CollectionController {
  public static async create(req: Request, res: Response) {
    // Validate request
    if (!req.body
      || !req.body.creator_email
      || !req.body.creator_name
      || !req.body.creator_image
      || !req.body.collection_name
      || !req.body.description
      || !req.body.mint_price
      || !req.body.total_supply
      || !req.body.images_uri
      || !req.body.jsons_uri) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    // Create a Collection
    const collection = {
      creator_email: req.body.creator_email,
      creator_name: req.body.creator_name,
      creator_image: req.body.creator_image,
      name: req.body.collection_name,
      desc: req.body.description,
      mint_price: parseInt(req.body.mint_price),
      total_supply: parseInt(req.body.total_supply),
      images_uri: req.body.images_uri,
      jsons_uri: req.body.jsons_uri,
      logo_uri: req.body.logo_uri,
      collection_address: req.body.collection_address,
      tx_hash: ""
    };

    // Create a collection onchain
    let txHash = await w3_create_collection(collection);
    if (!txHash) {
      res.status(400).send({
        message: "Creating Collection failed!"
      });
      return;
    }

    // update txHash
    collection.tx_hash = txHash;

    // Save Collection in the database
    db.Collection.create(collection)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Collection."
        });
      });
  }

  public static async all(req: Request, res: Response) {
    let creator_email = req.query.creator_email;
    let _promise = db.Collection.findAll();
    if (creator_email) {  
      _promise = db.Collection.findAll({
        where: {
          creator_email
        }
      });
    }
    _promise
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while listing the Collection."
        });
      });
  }

  public static async get_nft_name(req: Request, res: Response) {
    if (!req.body
      || !req.body.collection_name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    let collection_name = req.body.collection_name;
    db.Collection.findOne({
      where: {
        name: collection_name
      }
    }).then((found) => {
      if (!found) {
        res.status(400).send({
          message: "Not found!"
        });
        return;
      }
      let data = found.toJSON();
      getCurrentSupply(data.collection_address).then(v => {
        res.status(200).send({
          nft_name: collection_name + " #" + (v + 1),
          nft_uri: data.jsons_uri + "/" + (v + ".json"),
        })
      }).catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred."
        });
      });
    });
  }

  public static async getDetails(req: Request, res: Response) {
    res.status(200).send({})
  }
}