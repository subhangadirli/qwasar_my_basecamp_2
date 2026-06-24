const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const membersController = require('../controllers/membersController');
const attachmentsController = require('../controllers/attachmentsController');
const threadsController = require('../controllers/threadsController');
const messagesController = require('../controllers/messagesController');
const { isLoggedIn } = require('../middleware/auth');
const { isProjectOwner, isProjectAdmin, isProjectMember } = require('../middleware/roleCheck');
const { upload } = require('../config/upload');

router.get('/', isLoggedIn, projectsController.index);
router.get('/:id', isLoggedIn, projectsController.show);
router.post('/', isLoggedIn, projectsController.create);
router.put('/:id', isLoggedIn, isProjectOwner, projectsController.update);
router.delete('/:id', isLoggedIn, isProjectOwner, projectsController.destroy);

router.get('/:id/members', isLoggedIn, isProjectMember, membersController.index);
router.post('/:id/members', isLoggedIn, isProjectAdmin, membersController.create);
router.delete('/:id/members/:userId', isLoggedIn, isProjectAdmin, membersController.destroy);

router.get('/:id/attachments', isLoggedIn, isProjectMember, attachmentsController.index);
router.post('/:id/attachments', isLoggedIn, isProjectMember, upload.single('file'), attachmentsController.create);
router.get('/:id/attachments/:attachmentId/download', isLoggedIn, isProjectMember, attachmentsController.download);
router.delete('/:id/attachments/:attachmentId', isLoggedIn, isProjectMember, attachmentsController.destroy);

router.get('/:id/threads', isLoggedIn, isProjectMember, threadsController.index);
router.get('/:id/threads/:threadId', isLoggedIn, isProjectMember, threadsController.show);
router.post('/:id/threads', isLoggedIn, isProjectAdmin, threadsController.create);
router.put('/:id/threads/:threadId', isLoggedIn, isProjectAdmin, threadsController.update);
router.delete('/:id/threads/:threadId', isLoggedIn, isProjectAdmin, threadsController.destroy);

router.post('/:id/threads/:threadId/messages', isLoggedIn, isProjectMember, messagesController.create);
router.put('/:id/threads/:threadId/messages/:messageId', isLoggedIn, isProjectMember, messagesController.update);
router.delete('/:id/threads/:threadId/messages/:messageId', isLoggedIn, isProjectMember, messagesController.destroy);

module.exports = router;
