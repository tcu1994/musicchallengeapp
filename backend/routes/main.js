var express = require('express');
var router = express.Router();
const authJwt = require("../middleware/auth");
var mainController = require('../controllers/main');


router.post('/challenge',[authJwt.verifyToken], mainController.postChallenge);
router.get('/challenges',mainController.getChallenges);
router.get('/challenge',mainController.getChallenge);
router.post('/entry',[authJwt.verifyToken], mainController.postEntry);
router.post('/vote', [authJwt.verifyToken], mainController.vote);
router.get('/user', mainController.getUser);
router.post('/comment', [authJwt.verifyToken], mainController.postComment);
router.post('/delete-comment', [authJwt.verifyToken], mainController.deleteComment);
router.post('/delete-song', [authJwt.verifyToken], mainController.deleteSong);
router.post('/delete-challenge', [authJwt.verifyToken], mainController.deleteChallenge);
router.post('/set-link', [authJwt.verifyToken], mainController.setLink);
router.post('/send-message', [authJwt.verifyToken], mainController.sendMessage);
router.post('/get-inboxes', [authJwt.verifyToken], mainController.getInboxes);
router.post('/get-inbox', [authJwt.verifyToken], mainController.getInbox);
router.post('/new-inbox', [authJwt.verifyToken], mainController.newInbox);
router.post('/delete-inbox', [authJwt.verifyToken], mainController.deleteInbox);
router.post('/read-inbox', [authJwt.verifyToken], mainController.readInbox);
router.get('/unread-messages', [authJwt.verifyToken], mainController.unreadMessages);
router.post('/authors-choice', [authJwt.verifyToken], mainController.declareAuthorsChoice);
router.post('/play-song', mainController.playSong);
router.get('/search', mainController.search);
module.exports = router;