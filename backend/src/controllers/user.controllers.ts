
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nacl from 'tweetnacl';
import db from "../models";
import { w3_create_collection } from "../web3";

export class UserController {
  public static async create(req: Request, res: Response) {
    // Validate request
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
      nonce: ""
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
    let email = req.query.email;
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
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while listing Users."
        });
      });
  }

  public static async getNonce(req: Request, res: Response) {
    console.log("getNonce query =", req.query);
    if (!req.query || !req.query.walletAddress) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    let walletAddy = req.query.walletAddress;
    db.User.findAll({
      where: {
        wallet: walletAddy,
        role: 1 // check if admin
      }
    }).then((data) => {
      if (data.length === 0) {
        res.status(404).send({
          notFound: true,
          message: "You are not Admin!"
        });
      } else {
        let nonce = (Math.random() % 10000).toFixed(3);
        db.User.update({ nonce }, {
          where: {
            wallet: walletAddy
          }
        }).then(() => {
          res.status(200).send({ nonce })
        }).catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating a nonce."
          });
        })
      }
    });
  }

  public static async verifyAdmin(req: Request, res: Response) {
    // Validate request
    console.log("req.body =", req.body);
    if (!req.body
      || !req.body.fullMessage
      || !req.body.signature
      || !req.body.walletAddress
      || !req.body.publicKey
    ) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    let signature = req.body.signature as string;
    signature = signature.slice(2, 130);
    let signatureBytes: Array<number> = [];
    for (let i = 0; i < signature.length; i += 2) {
      let x = parseInt(signature[i], 16);
      let y = parseInt(signature[i+1], 16);
      let v = x * 16 + y;
      signatureBytes.push(v);
    }

    let pkBytes: Array<number> = [];
    for (let i = 0; i < signature.length; i += 2) {
      let x = parseInt(signature[i], 16);
      let y = parseInt(signature[i+1], 16);
      let v = x * 16 + y;
      signatureBytes.push(v);
    }

    db.User.findOne({
      where: {
        wallet: req.body.walletAddress,
      }
    }).then((data) => {
      console.log("data.toJson =", data.toJSON())
      const verified = nacl.sign.detached.verify(
        Buffer.from(req.body.fullMessage),
        new Uint8Array(signatureBytes),
        Buffer.from(req.body.publicKey, 'hex'),
      );
      if (verified) {
        const tok = {
          name: 'Auth',
          walletAddress: req.body.walletAddress,
          signature: req.body.signature,
          nonce: data.toJSON().nonce,
        };
        let jwtToken = jwt.sign({ data: tok }, "token key", { expiresIn: '24h' });
        res.send({ jwtToken });
      } else {
        res.status(400).send({
          message: "verify failed!"
        });
      }
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while verifying a User."
      });
    });
  }

}