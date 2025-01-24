const CatwayModel = require("../models/catways.model");

/**
 * Récupère tous les catways et les rend dans la vue EJS.
 *
 * Cette fonction récupère tous les catways dans la base de données à l'aide du modèle `CatwayModel`, puis passe ces catways
 * à la vue `catways` pour affichage.
 *
 * @param {Object} req - La requête HTTP (non utilisée dans cette fonction mais présente pour la signature).
 * @param {Object} res - La réponse HTTP utilisée pour rendre la vue avec les catways.
 *
 * @returns {void} - Rend la vue `catways` avec les données des catways.
 */

module.exports.getCatways = async (req, res) => {
    try {
        const catways = await CatwayModel.find();
        res.render('catways', { catways });  // Utilisation de res.render pour passer les catways à la vue EJS
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catways" });
    }
};

/**
 * Affiche les détails d'un catway spécifique.
 *
 * Cette fonction récupère un catway spécifique à partir de son ID dans la base de données, puis passe les informations
 * à la vue `catwayDetails`. Si le catway n'est pas trouvé, elle renvoie une erreur 404.
 *
 * @param {Object} req - La requête HTTP contenant l'ID du catway à afficher dans `req.params.id`.
 * @param {Object} res - La réponse HTTP utilisée pour rendre la vue avec les détails du catway.
 *
 * @returns {void} - Rend la vue `catwayDetails` avec les informations du catway.
 */

module.exports.viewCatway = async (req, res) => {
    try {
        const catway = await CatwayModel.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ message: "Catway non trouvé" });
        }
        // Affiche la vue avec les informations du catway et le formulaire pour modification
        res.render('catwayDetails', { catway }); 
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: "Erreur lors de l'affichage des détails du catway" });
    }
};

/**
 * Crée un nouveau catway dans la base de données.
 *
 * Cette fonction crée un nouveau catway avec les données reçues dans `req.body` et enregistre celui-ci dans la base de données.
 * Si la création réussit, elle renvoie l'objet catway nouvellement créé.
 *
 * @param {Object} req - La requête HTTP contenant les données du catway à créer dans `req.body`.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer une réponse avec le catway créé.
 *
 * @returns {Object} - La réponse HTTP contenant le catway nouvellement créé.
 */

module.exports.setCatways = async (req, res) => {
    // créer un catway
    const catway = await CatwayModel.create({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState
    });

    res.status(200).json(catway);
};

/**
 * Modifie un catway existant avec de nouvelles données.
 *
 * Cette fonction met à jour un catway spécifique en fonction de son ID, puis redirige vers la page des détails du catway
 * après une mise à jour réussie. Si le catway n'existe pas, elle renvoie une erreur.
 *
 * @param {Object} req - La requête HTTP contenant l'ID du catway à modifier dans `req.params.id` et les nouvelles données dans `req.body`.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer une réponse après la mise à jour.
 *
 * @returns {void} - Redirige vers la page des détails du catway après mise à jour ou renvoie une erreur en cas d'échec.
 */

module.exports.editCatway = async (req, res) => {
    const { id } = req.params;
    const { catwayNumber, type, catwayState } = req.body;

    try {
        // Mise à jour du catway avec les nouvelles données
        const updatedCatway = await CatwayModel.findByIdAndUpdate(id, {
            catwayNumber,
            type,
            catwayState,
        }, { new: true });

        if (!updatedCatway) {
            return res.status(400).json({ message: "Ce catway n'existe pas." });
        }

        // Rediriger vers la page des détails du catway après la mise à jour
        res.redirect(`/catways/${id}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du catway" });
    }
};

/**
 * Supprime un catway de la base de données.
 *
 * Cette fonction supprime un catway existant en fonction de son ID passé dans `req.params.id`. Si le catway n'existe pas,
 * une erreur est renvoyée. Sinon, le catway est supprimé et un message de confirmation est renvoyé.
 *
 * @param {Object} req - La requête HTTP contenant l'ID du catway à supprimer dans `req.params.id`.
 * @param {Object} res - La réponse HTTP utilisée pour envoyer un message de succès ou d'erreur après la suppression.
 *
 * @returns {Object} - La réponse HTTP contenant un message de succès après suppression ou une erreur si le catway n'est pas trouvé.
 */

module.exports.deleteCatway = async (req, res) => {
    // trouver le catway grâce à son id
    const catway = await CatwayModel.findById(req.params.id)
    if (!catway) {
        res.status(400).json({ message: "Ce catway n'existe pas"});
    }

    await catway.deleteOne();
    res.status(200).json(" catway supprimé " + req.params.id);

}