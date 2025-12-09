import equipmentModel from "../models/equipment-model.js";


const controller = {
    getAll: async function (req, res){
        try {
            const result = await equipmentModel.find({});
            if (result.length === 0){
                return res.status(200).json([]);
            } else {
                res.status(200).json(result);
            }

        } catch (error) {
            res.status(500).json({message: "Erro ao buscar equipamentos", error: error.message});
        }   
    },
    getOne: async function (req, res){
        try {
            const result = await equipmentModel.findOne({id: req.params.id});
            if (!result) {
                return res.status(404).json({message: "Equipamento não encontrado"});
            }
            const equipment = result.toObject();
            res.status(200).json(equipment);
        } catch (error) {
            res.status(500).json({message: "Erro ao buscar equipamento", error: error.message});
        }
    },
    create: async function (req, res){
        try {
            const result = await equipmentModel.create(req.body);
            const equipment = result.toObject();
            res.status(201).json({message: "Equipamento criado com sucesso", equipment});
        } catch (error) {
            res.status(500).json({message: "Erro ao criar equipamento", error: error.message});
        }
    },
    deleteOne: async function (req, res){
        try {
            const result = await equipmentModel.deleteOne({id: req.params.id});
            res.status(200).json({message: "Equipamento deletado com sucesso"}); 
        } catch (error) {
            res.status(500).json({message: "Erro ao deletar equipamento", error: error.message});
        }
    },
    editOne: async function (req, res){
        try {
            const result = await equipmentModel.updateOne({id: req.params.id}, req.body);
            res.status(200).json({message: "Equipamento atualizado com sucesso"});
        } catch (error) {
            res.status(500).json({message: "Erro ao atualizar equipamento", error: error.message});
        }
    },

    applyDiscount: async function (req, res){
        try {
            const { discountPercentage } = req.body;
            const equipmentId = req.params.id;

            if (discountPercentage < 0 || discountPercentage > 100) {
                return res.status(400).json({message: "Desconto deve estar entre 0 e 100%"});
            }

            const equipment = await equipmentModel.findOne({id: equipmentId});
            if (!equipment) {
                return res.status(404).json({message: "Equipamento não encontrado"});
            }

            const discountedPrice = equipment.price - (equipment.price * discountPercentage) / 100;
            
            const result = await equipmentModel.updateOne(
                {id: equipmentId}, 
                {discountPercentage: discountPercentage, discountedPrice: Number(discountedPrice.toFixed(2))}
            );

            res.status(200).json({
                message: "Desconto aplicado com sucesso",
                discountPercentage,
                discountedPrice: Number(discountedPrice.toFixed(2))
            });
        } catch (error) {
            res.status(500).json({message: "Erro ao aplicar desconto", error: error.message});
        }
    },

    removeDiscount: async function (req, res){
        try {
            const equipmentId = req.params.id;

            const result = await equipmentModel.updateOne(
                {id: equipmentId}, 
                {discountPercentage: 0, discountedPrice: 0}
            );

            res.status(200).json({message: "Desconto removido com sucesso"});
        } catch (error) {
            res.status(500).json({message: "Erro ao remover desconto", error: error.message});
        }
    },
}

export default controller;
