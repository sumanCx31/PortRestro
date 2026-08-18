const staffRouter  = require('express').Router();

staffRouter.post('/login',staffCltr.login);                             // Create staff (Owner only)