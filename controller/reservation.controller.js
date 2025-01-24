const ReservationModel = require("../models/reservations.model");
const CatwayModel = require("../models/catways.model");


/**
 * Crée une nouvelle réservation.
 *
 * Cette fonction prend les informations d'une réservation depuis le corps de la requête (`req.body`), vérifie si le catway
 * existe, puis enregistre une nouvelle réservation dans la base de données. Si la création est réussie, elle renvoie une réponse
 * avec les détails de la réservation. Si une erreur survient, une réponse d'erreur est envoyée.
 *
 * @param {Object} req - La requête HTTP contenant les informations de la réservation dans `req.body`.
 * @param {Object} res - La réponse HTTP pour envoyer un message de succès ou d'erreur après la création de la réservation.
 *
 * @returns {Object} - La réponse HTTP contenant un message de succès et la réservation créée en cas de succès, ou un message d'erreur en cas d'échec.
 */

module.exports.createReservation = async (req, res) => {
    const { catway, clientName, boatName, checkIn, checkOut } = req.body;

    const selectedCatway = await CatwayModel.findById(catway);
    if (!selectedCatway) {
        return res.status(400).json({ message: "Catway non trouvé" });
    }

    try {
        const reservation = new ReservationModel({
            catway,
            clientName,
            boatName,
            checkIn,
            checkOut,
        });

        await reservation.save();

        res.status(201).json({ message: "Réservation créée avec succès", reservation });
    } catch (error) {
        console.error("Erreur lors de la création de la réservation", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * Supprime une réservation existante.
 *
 * Cette fonction supprime une réservation spécifique en fonction de l'ID passé dans `req.params.id`. Elle met également à jour
 * l'état du catway associé à la réservation en le marquant comme "disponible". Si la réservation n'est pas trouvée, une erreur est
 * renvoyée. Si la suppression réussit, un message de succès est envoyé.
 *
 * @param {Object} req - La requête HTTP contenant l'ID de la réservation à supprimer dans `req.params.id`.
 * @param {Object} res - La réponse HTTP pour envoyer un message de succès ou d'erreur suite à la suppression de la réservation.
 *
 * @returns {Object} - La réponse HTTP contenant un message de succès si la réservation est supprimée, ou un message d'erreur si la réservation n'est pas trouvée.
 */

module.exports.deleteReservation = async (req, res) => {

    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) {
        return res.status(400).json({ message: "Réservation non trouvée" });
    }

    const catway = await CatwayModel.findById(reservation.catway);
    catway.catwayState = "disponible";
    await catway.save();

    await reservation.deleteOne();
    res.status(200).json({ message: "Réservation supprimée avec succès" });
};

/**
 * Récupère toutes les réservations existantes.
 *
 * Cette fonction récupère toutes les réservations dans la base de données et les renvoie dans la réponse HTTP. Si des réservations
 * existent, elles sont envoyées sous forme de tableau dans la réponse. Si aucune réservation n'est trouvée, une réponse vide est renvoyée.
 *
 * @param {Object} req - La requête HTTP pour récupérer les réservations.
 * @param {Object} res - La réponse HTTP pour envoyer la liste des réservations récupérées.
 *
 * @returns {Array} - La réponse HTTP contenant un tableau de toutes les réservations existantes dans la base de données.
 */

module.exports.getReservations = async (req, res) => {
    const reservations = await ReservationModel.find();
    res.status(200).json(reservations)

}
