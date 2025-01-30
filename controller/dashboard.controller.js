const CatwayModel = require('../models/catways.model'); 
const ReservationModel = require('../models/reservations.model'); 
const UserModel = require('../models/users.model')

/**
 * Récupère les données nécessaires au tableau de bord (catways et réservations).
 *
 * Cette fonction récupère tous les catways et réservations de la base de données et les envoie à la vue `dashboard.ejs`.
 * Elle utilise également `populate()` pour récupérer les informations complètes des catways associés aux réservations.
 *
 * @param {Object} req - La requête HTTP (contient des informations sur l'utilisateur authentifié dans `req.user`).
 * @param {Object} res - La réponse HTTP utilisée pour rendre la vue avec les données des catways et des réservations.
 *
 * @returns {void} - Rendu de la vue `dashboard` avec les données nécessaires.
 */

module.exports.getDashboard = async (req, res) => {
  try {
    const catways = await CatwayModel.find();
    
    const reservations = await ReservationModel.find().populate('catway'); 

    const users = await UserModel.find();

    res.status(200).render('dashboard', { catways, reservations, users, user: req.user });
  } catch (error) {
    console.error("Erreur lors de la récupération des données du dashboard", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/**
 * Crée un nouveau catway.
 *
 * Cette fonction crée un nouveau catway en fonction des données envoyées dans `req.body` et le sauvegarde dans la base de données.
 * Si l'opération réussit, l'utilisateur est redirigé vers la page du tableau de bord.
 *
 * @param {Object} req - La requête HTTP contenant les données du catway dans `req.body`.
 * @param {Object} res - La réponse HTTP utilisée pour rediriger vers le tableau de bord après la création.
 *
 * @returns {void} - Redirection vers `/dashboard` après la création réussie du catway.
 */

module.exports.createCatway = async (req, res) => {
    const { catwayNumber, type, catwayState } = req.body;
    const newCatway = new CatwayModel({ catwayNumber, type, catwayState });
    try {
      await newCatway.save();
      
      // Rediriger vers la page dashboard après la création
      res.redirect('/dashboard');
    } catch (error) {
      console.error("Erreur lors de la création du catway", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  


  /**
 * Modifie un catway existant.
 *
 * Cette fonction met à jour les informations d'un catway existant en fonction de son ID (passé dans `req.params.id`),
 * avec les nouvelles données reçues dans `req.body`.
 * Si la mise à jour réussit, l'utilisateur est redirigé vers la page d'accueil.
 *
 * @param {Object} req - La requête HTTP contenant l'ID du catway dans `req.params.id` et les nouvelles données dans `req.body`.
 * @param {Object} res - La réponse HTTP utilisée pour rediriger vers la page d'accueil après la mise à jour réussie.
 *
 * @returns {void} - Redirection vers la page d'accueil après la mise à jour réussie du catway.
 */

  module.exports.editCatway = async (req, res) => {
    const { catwayNumber, type, catwayState } = req.body;
    try {
      const catway = await CatwayModel.findByIdAndUpdate(
        req.params.id,
        { catwayNumber, type, catwayState },
        { new: true }
      );
      if (!catway) {
        return res.status(404).json({ message: "Catway non trouvé" });
      }
      res.status(200).json(catway);  
    } catch (error) {
      console.error("Erreur lors de la modification du catway", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  

/**
 * Supprime un catway de la base de données.
 *
 * Cette fonction supprime un catway spécifique de la base de données en fonction de l'ID passé dans `req.params.id`.
 * Si le catway n'est pas trouvé, une erreur est renvoyée.
 * Si la suppression réussit, un message de succès est renvoyé.
 *
 * @param {Object} req - La requête HTTP contenant l'ID du catway à supprimer dans `req.params.id`.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer une réponse après la suppression.
 *
 * @returns {Object} - La réponse HTTP contenant un message de succès après la suppression ou une erreur si le catway n'est pas trouvé.
 */

module.exports.deleteCatway = async (req, res) => {
  try {
    const catway = await CatwayModel.findByIdAndDelete(req.params.id);
    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }
    res.status(200).json({ message: "Catway supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du catway", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



/**
 * Récupère tous les utilisateurs.
 *
 * Cette fonction récupère tous les utilisateurs dans la base de données et les envoie au frontend.
 *
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 *
 * @returns {void} - Renvoie les utilisateurs au frontend.
 */
module.exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).render("dashboard", { users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Crée un nouvel utilisateur.
 *
 * Cette fonction crée un utilisateur à partir des données reçues dans la requête et les envoie à la base de données.
 *
 * @param {Object} req - La requête HTTP contenant les données de l'utilisateur.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer la réponse après la création.
 *
 * @returns {void} - Redirige vers la page du tableau de bord après la création de l'utilisateur.
 */
module.exports.setUsers = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new UserModel({ name, email, password, role });
    await newUser.save();

    // Redirige vers le tableau de bord après l'ajout de l'utilisateur
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Supprime un utilisateur par son ID.
 *
 * Cette fonction supprime un utilisateur de la base de données à partir de l'ID fourni dans les paramètres de la requête.
 *
 * @param {Object} req - La requête HTTP contenant l'ID de l'utilisateur à supprimer.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer une réponse après la suppression.
 *
 * @returns {void} - Renvoie un message de succès après la suppression.
 */
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


