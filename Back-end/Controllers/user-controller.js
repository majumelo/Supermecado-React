import userModel from "../models/user-model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const controller = {
    getAll: async function (req, res){
        try {
            const result = await userModel.find({});
            if (result.length === 0){
                return res.status(400).json({message: "Nenhum usuário encontrado"});
            } else {
                // Remover senha da resposta
                const usersWithoutPassword = result.map(user => {
                    const { password, ...userWithoutPassword } = user.toObject();
                    return userWithoutPassword;
                });
                res.status(200).json(usersWithoutPassword);
            }

        } catch (error) {
            res.status(500).json({message: "Erro ao buscar usuários", error: error.message});
        }   
    },
    getOne: async function (req, res){
        try {
            const result = await userModel.findOne({id: req.params.id});
            if (!result) {
                return res.status(404).json({message: "Usuário não encontrado"});
            }
            const user = result.toObject();
            delete user.password;
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({message: "Erro ao buscar usuário", error: error.message});
        }
    },
    create: async function (req, res){
        try {
            const hash = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;

            const result = await userModel.create(req.body);
            const user = result.toObject();
            delete user.password;
            res.status(201).json({message: "Usuário criado com sucesso", user});
        } catch (error) {
            res.status(500).json({message: "Erro ao criar usuário", error: error.message});
        }
    },
    deleteOne: async function (req, res){
        try {
            const result = await userModel.deleteOne({id: req.params.id});
            res.status(200).json({message: "Usuário deletado com sucesso"}); 
        } catch (error) {
            res.status(500).json({message: "Erro ao deletar usuário", error: error.message});
        }
    },
    editOne: async function (req, res){
        try {
            const updateData = { ...req.body };
            // Se houver senha, criptografar
            if (updateData.password) {
                updateData.password = bcrypt.hashSync(updateData.password, 10);
            }
            const result = await userModel.updateOne({id: req.params.id}, updateData);
            res.status(200).json({message: "Usuário atualizado com sucesso"});
        } catch (error) {
            res.status(500).json({message: "Erro ao atualizar usuário", error: error.message});
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const result = await userModel.findOne({ email });
            if (!result) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const user = result.toObject();
            const isMatch = bcrypt.compareSync(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }

            delete user.password;
            const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login bem-sucedido", token: token, user: user });
        } catch (error) {
            res.status(500).json({message: "Erro ao fazer login", error: error.message});
        }
    }
}

export default controller;