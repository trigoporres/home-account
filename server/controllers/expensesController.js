var expensesModel = require('../models/expensesModel.js');
var userModel = require('../models/userModel.js');

module.exports = {

    list: function (req, res) {
        expensesModel.find(function (err, expensess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting expenses.',
                    error: err
                });
            }
            return res.json(expensess);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        expensesModel.findOne({_id: id}, function (err, expenses) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting expenses.',
                    error: err
                });
            }
            if (!expenses) {
                return res.status(404).json({
                    message: 'No such expenses'
                });
            }
            return res.json(expenses);
        });
    },

    create: function (req, res) {
      console.log(req.body);
        var expenses = new expensesModel({
          creator : req.body.expenses.creator,
			    name : req.body.expenses.name,
			    company : req.body.expenses.company,
			    quantity : req.body.expenses.quantity,
			    monthly : req.body.expenses.monthly,
			    fin : req.body.expenses.fin,
			    facture : req.body.expenses.facture
        });

        expenses.save()
        .then(expenses => {
          console.log("vamos a hacer busqueda de expenses");
            userModel.findOne({_id: expenses.creator})
            .then(user =>{
              user.salary = user.salary - expenses.quantity ;
              user.save()
                .then( ()=> res.status(200).json(user));
            });
        });
    },

    update: function (req, res) {
        var id = req.params.id;
        expensesModel.findOne({_id: id}, function (err, expenses) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting expenses',
                    error: err
                });
            }
            if (!expenses) {
                return res.status(404).json({
                    message: 'No such expenses'
                });
            }
            creator = req.user._id;
            expenses.name = req.body.name ? req.body.name : expenses.name;
			expenses.company = req.body.company ? req.body.company : expenses.company;
			expenses.quantity = req.body.quantity ? req.body.quantity : expenses.quantity;
			expenses.monthly = req.body.monthly ? req.body.monthly : expenses.monthly;
			expenses.fin = req.body.fin ? req.body.fin : expenses.fin;
			expenses.facture = req.body.facture ? req.body.facture : expenses.facture;

            expenses.save(function (err, expenses) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating expenses.',
                        error: err
                    });
                }

                return res.json(expenses);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;
        expensesModel.findByIdAndRemove(id, function (err, expenses) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the expenses.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
