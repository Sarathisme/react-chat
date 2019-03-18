const { User } = require('../models/Users');

class Dashboard {

    static get_user(id) {
        return new Promise((resolve, reject) => {
            User.findOne({id: id}, (err, user) => {
                if(err) {
                    reject(err);
                } else {
                    resolve({
                        "photo": user.photo,
                        "name": user.name
                    });
                }
            });
        });
    }

    static add_user(newUser) {
        return new Promise(function (resolve, reject) {
            User.findOne({id: newUser.id}, (err, user) => {
                if(err) {
                    reject(err);
                } else {
                    if (user !== null) {
                        resolve({"message": "success"});
                    } else {
                        newUser.save(function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({"message": "success"});
                            }
                        });
                    }
                }
            });
        })
    }

    static get_users(id, query) {
        let queryCond = {};

        if(query){
            queryCond.name={$regex:query,$options:"i", };
        }

        return new Promise((resolve => {
            if(query !== '') {
                User.find({ $and: [{ name: { '$regex': query, '$options': 'i' } }, { id: { $ne: id } } ]}, (err, users) => {
                    resolve({"results": users});
                });
            } else {
                resolve({"results": []});
            }
        }));
    }
}

module.exports = Dashboard;