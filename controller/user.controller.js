const UserModel = require("../models/users.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.getUsers = async (req, res) => {
    const users = await UserModel.find();
    res.status(200).json(users)

}
module.exports.setUsers = async (req, res) => {
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });

    res.status(200).json(user);
};

module.exports.editUser = async (req, res) => {
    try {
        // Vérifie si l'utilisateur existe avec l'ID
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
        }

        // Si l'utilisateur existe, on met à jour les données
        const updateUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(200).json(updateUser);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};



module.exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ message: "Cet utilisateur n'existe pas" });
        }

        await user.deleteOne();
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


module.exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si c'est un admin
    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Créer un token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Connexion réussie", token });
};



module.exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier si un utilisateur avec le même email existe déjà
        const existingAdmin = await UserModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hasher le mot de passe avant de le stocker
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Créer un nouvel utilisateur avec le rôle "admin"
        const admin = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });

        // Sauvegarder l'utilisateur dans la base de données
        await admin.save();
        
        res.status(201).json({ message: 'Admin créé avec succès !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
    }
};
