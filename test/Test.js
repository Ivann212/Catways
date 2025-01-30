const { loginAdmin, editUser } = require('../controller/user.controller');
const user = require('../models/users.model');
const catway = require('../models/catways.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  
const assert = require('assert');
const sinon = require('sinon'); 
const reservations = require('../models/reservations.model')
const { createReservation, deleteReservation } = require('../controller/reservation.controller');
const CatwayModel = require('../models/catways.model');
const { setUsers, deleteUser, createCatway, deleteCatway, editCatway } = require('../controller/dashboard.controller');





describe('Fonction login', function() {
    it('Doit retourner un token valide', async function() {

        const req = {
            body: {
                email: 'admin@admin.com',
                password: 'adminmdp'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis() 
        };

        const mockUser = {
            _id: '678fbbe06586dd3c64854396',
            email: 'admin@admin.com',
            password: '$2b$10$Nfdb7Vj9N9lXQvNJ68TYh./ljVoPlBP7jPR9dhA3U8OkT1Kl6Psu', 
            role: 'admin'
        };


        sinon.stub(user, 'findOne').resolves(mockUser);

        sinon.stub(bcrypt, 'compare').resolves(true);


        sinon.stub(jwt, 'sign').returns('fake-jwt-token'); 

        await loginAdmin(req, res);

        assert(res.status.calledWith(200), 'Le statut de la réponse devrait être 200');

        assert(res.json.calledWithMatch({
            message: 'Connexion réussie',
            token: 'fake-jwt-token' 
        }), 'La réponse JSON devrait contenir un message et un token valide');

        user.findOne.restore();
        bcrypt.compare.restore();
        jwt.sign.restore(); 
    });
});

describe('Fonction setUsers', function() {
    it('Doit créer un nouvel utilisateur et rediriger vers le dashboard', async function() {

        const req = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
            },
        };

        const res = {
            redirect: sinon.stub(), 
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

        sinon.stub(user.prototype, 'save').resolves();

        await setUsers(req, res);

        assert(res.redirect.calledWith('/dashboard'), 'La redirection devrait se faire vers /dashboard');

        user.prototype.save.restore();
    });
});


describe('Fonction deleteUser', function() {
    it('Doit supprimer un utilisateur et retourner un message de succès', async function() {

        const req = {
            params: {
                id: 'userId123', 
            },
        };

        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

        const mockUser = { _id: 'userId123', name: 'John Doe', deleteOne: sinon.stub().resolves() };
        
        const findByIdStub = sinon.stub(user, 'findById').resolves(mockUser);

        await deleteUser(req, res);

        assert(findByIdStub.calledOnceWith('userId123'), 'La méthode findById devrait être appelée avec l\'ID de l\'utilisateur');

        assert(mockUser.deleteOne.calledOnce, 'La méthode deleteOne devrait être appelée sur l\'utilisateur');

        assert(res.json.calledWith({ message: 'Utilisateur supprimé avec succès' }), 'Le message de succès devrait être retourné');

        findByIdStub.restore();
    });
});

describe('Fonction editUser', function() {
    it('Doit modifier un utilisateur et retourner les données modifiées', async function() {

        const userId = 'userId123';
        const updatedData = {
            name: 'John Doe Updated',
            email: 'john_updated@example.com',
            password: 'newpassword123',
            role: 'user',
        };


        const req = {
            params: { id: userId }, 
            body: updatedData, 
        };

        // Mock de la réponse (res)
        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

        const mockUser = { _id: userId, name: 'John Doe', email: 'john@example.com', save: sinon.stub().resolves() };

        const findByIdStub = sinon.stub(user, 'findById').resolves(mockUser);

        const findByIdAndUpdateStub = sinon.stub(user, 'findByIdAndUpdate').resolves(mockUser);

        await editUser(req, res);

        assert(findByIdStub.calledOnceWith(userId), 'La méthode findById doit être appelée avec l\'ID de l\'utilisateur');

        assert(findByIdAndUpdateStub.calledOnceWith(userId, updatedData, { new: true }), 'La méthode findByIdAndUpdate doit être appelée avec l\'ID et les nouvelles données');

        assert(res.status.calledWith(200), 'Le statut de la réponse doit être 200');

        assert(res.json.calledWith(mockUser), 'La réponse JSON doit contenir l\'utilisateur mis à jour');

        findByIdStub.restore();
        findByIdAndUpdateStub.restore();
    });
});

describe('Fonction createCatway', function() {
    it('Doit créer un nouveau catway', async function() {
        const req = {
            body: {
                catwayNumber: '55',
                type: 'short',
                catwayState: 'bon état',
            }
        }
        const res = {
            redirect: sinon.stub(), 
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(),
        };
        sinon.stub(catway.prototype, 'save').resolves();

        await createCatway(req, res);

        assert(res.redirect.calledWith('/dashboard'), 'La redirection devrait se faire vers /dashboard');

        catway.prototype.save.restore();
    })
})


describe('fonction deleteCatway', function () {
    it('Doit supprimer un catway', async function() {
        const req = {
            params: {
                id: '12', 
            },
        };
        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

  
        const mockCatway = { _id: '12', catwayNumber: '55' }; 

        const findByIdAndDeleteStub = sinon.stub(catway, 'findByIdAndDelete').resolves(mockCatway);

        await deleteCatway(req, res);

        assert(findByIdAndDeleteStub.calledOnceWith('12'), 'La méthode findByIdAndDelete devrait être appelée avec l\'ID du catway');

        assert(res.json.calledWith({ message: 'Catway supprimé' }), 'Le message de succès devrait être retourné');

        findByIdAndDeleteStub.restore();
    });
});



describe('Fonction editCatway', function() {
    it('Doit modifier un catway et retourner les données modifiées', async function() {
        const catwayId = '12';
        const updatedData = {
            catwayNumber: '55',
            type: 'short',
            catwayState: 'bon état',
        };

        const req = {
            params: { id: catwayId }, 
            body: updatedData, 
        };

        // Mock de la réponse (res)
        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

        const mockCatway = { _id: catwayId, ...updatedData };

        const findByIdAndUpdateStub = sinon.stub(catway, 'findByIdAndUpdate').resolves(mockCatway);

        await editCatway(req, res);

        assert(findByIdAndUpdateStub.calledOnceWith(catwayId, updatedData, { new: true }), 
            'La méthode findByIdAndUpdate doit être appelée avec l\'ID du catway et les nouvelles données');

        assert(res.status.calledWith(200), 'Le statut de la réponse doit être 200');

        assert(res.json.calledWith(mockCatway), 'La réponse JSON doit contenir le catway mis à jour');

        findByIdAndUpdateStub.restore();
    });
});


describe('Fonction createReservation', function() {

    let sandbox;

    beforeEach(function() {
        sandbox = sinon.createSandbox(); 
    });

    afterEach(function() {
        sandbox.restore(); 
    });

    it('Doit créer une réservation avec succès', async function() {

        
        const reservationData = {
            catway: '12',
            clientName: 'John Doe',
            boatName: 'BoatX',
            checkIn: '2025-02-01',
            checkOut: '2025-02-10',
        };

        
        const req = {
            body: reservationData, 
        };

    
        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

      
        const mockCatway = { _id: '12', catwayNumber: '1' };

        const findByIdStub = sandbox.stub(CatwayModel, 'findById').resolves(mockCatway);

        const saveStub = sandbox.stub(reservations.prototype, 'save').resolves();

        await createReservation(req, res);

        assert(findByIdStub.calledOnceWith(reservationData.catway), 'La méthode findById doit être appelée avec l\'ID du catway');

        assert(saveStub.calledOnce, 'La méthode save de reservations devrait être appelée');

        assert(res.status.calledWith(201), 'Le statut de la réponse doit être 201');

        assert(res.json.calledWith({ message: 'Réservation créée avec succès', reservation: sinon.match.object }), 'La réponse JSON doit contenir le message de succès et la réservation');
    });

});



describe('Fonction deleteReservation', function() {

    let sandbox;

    beforeEach(function() {
        sandbox = sinon.createSandbox(); 
    });

    afterEach(function() {
        sandbox.restore(); 
    });

    it('Doit supprimer une réservation et mettre à jour l\'état du catway', async function() {

      
        const reservationId = '1';
        const mockReservation = {
            _id: reservationId,
            catway: '12',
            deleteOne: sinon.stub().resolves(), 
        };

        const mockCatway = {
            _id: '12',
            catwayState: 'occupé',
            save: sinon.stub().resolves(), 
        };

        const req = {
            params: { id: reservationId }, 
        };


        const res = {
            status: sinon.stub().returnsThis(), 
            json: sinon.stub().returnsThis(), 
        };

        const findByIdReservationStub = sandbox.stub(reservations, 'findById').resolves(mockReservation);

        const findByIdCatwayStub = sandbox.stub(CatwayModel, 'findById').resolves(mockCatway);

        await deleteReservation(req, res);

        assert(findByIdReservationStub.calledOnceWith(reservationId), 'La méthode findById de reservations doit être appelée avec l\'ID de la réservation');

        assert(findByIdCatwayStub.calledOnceWith(mockReservation.catway), 'La méthode findById de CatwayModel doit être appelée avec l\'ID du catway');

        assert(mockCatway.catwayState === 'disponible', 'L\'état du catway doit être mis à jour en "disponible"');

        assert(mockCatway.save.calledOnce, 'La méthode save doit être appelée pour enregistrer le catway');

        assert(mockReservation.deleteOne.calledOnce, 'La méthode deleteOne doit être appelée pour supprimer la réservation');

        assert(res.status.calledWith(200), 'Le statut de la réponse doit être 200');

        assert(res.json.calledWith({ message: 'Réservation supprimée avec succès' }), 'La réponse JSON doit contenir le message de succès');
    });

});









